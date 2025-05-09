import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

type NaverBookSearchRequest = Request<
  {},
  {},
  {},
  {
    query: string;
    display?: number;
    start?: number;
    sort?: "sim" | "date";
  }
>;

export const getBooks = async (req: NaverBookSearchRequest, res: Response) => {
  try {
    const { query, display = 10, start = 1, sort = "sim" } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const response = await axios.get(
      "https://openapi.naver.com/v1/search/book.json",
      {
        params: {
          query,
          display,
          start,
          sort,
        },
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
        },
      }
    );

    // Transform the response to match our database schema
    const books = response.data.items.map((item: any) => ({
      title: item.title.replace(/<[^>]*>/g, ""), // Remove HTML tags
      link: item.link,
      image: item.image,
      author: item.author,
      publisher: item.publisher,
      pubDate: new Date(item.pubdate),
      isbn: item.isbn.split(" ")[0], // Take first ISBN if multiple
      description: item.description.replace(/<[^>]*>/g, ""), // Remove HTML tags
      price: item.price,
      discount: item.discount,
    }));

    res.json({
      total: response.data.total,
      start: response.data.start,
      display: response.data.display,
      items: books,
    });
  } catch (error) {
    console.error("Search books error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createBook = async (
  req: Request<{}, {}, {}, { isbn: string }>,
  res: Response
) => {
  try {
    const { isbn } = req.query;

    // Check if book with ISBN already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn },
    });

    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    // Search from Naver API
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/book_adv.json",
      {
        params: {
          d_isbn: isbn,
          display: 1,
          start: 1,
          sort: "sim",
        },
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
        },
      }
    );

    // If no results from Naver API
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Transform the Naver API response
    const naverBook = response.data.items[0];

    // Create a default category if none exists
    let category = await prisma.category.findFirst({
      where: { name: "기타" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: "기타" },
      });
    }

    // Create book
    const newBook = await prisma.book.create({
      data: {
        title: naverBook.title.replace(/<[^>]*>/g, ""),
        link: naverBook.link,
        image: naverBook.image,
        author: naverBook.author,
        publisher: naverBook.publisher,
        pubDate: new Date(
          naverBook.pubdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
        ),
        isbn: naverBook.isbn.split(" ")[0],
        description: naverBook.description.replace(/<[^>]*>/g, ""),
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = {};

    // Only add fields to updateData if they exist in req.body
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.link) updateData.link = req.body.link;
    if (req.body.image) updateData.image = req.body.image;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.publisher) updateData.publisher = req.body.publisher;
    if (req.body.pubDate) updateData.pubDate = new Date(req.body.pubDate);
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.categoryId) {
      // Find or create category
      let category = await prisma.category.findFirst({
        where: { id: req.body.categoryId },
      });

      if (!category) {
        const defaultCategory = await prisma.category.findFirst({
          where: { name: "기타" },
        });

        if (!defaultCategory) {
          category = await prisma.category.create({
            data: { id: req.body.categoryId, name: "기타" },
          });
        } else {
          category = defaultCategory;
        }
      }

      updateData.categoryId = category.id;
    }

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookByIsbn = async (req: Request, res: Response) => {
  try {
    const { isbn } = req.params;

    // First, try to find the book in our database
    const book = await prisma.book.findUnique({
      where: { isbn },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // If book is found in our database, return it
    if (book) {
      return res.json(book);
    }

    // If book is not found, search from Naver API
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/book_adv.json",
      {
        params: {
          d_isbn: isbn,
          display: 1,
          start: 1,
          sort: "sim",
        },
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
        },
      }
    );

    // If no results from Naver API
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Transform the Naver API response
    const naverBook = response.data.items[0];
    const transformedBook = {
      title: naverBook.title.replace(/<[^>]*>/g, ""),
      link: naverBook.link,
      image: naverBook.image,
      author: naverBook.author,
      publisher: naverBook.publisher,
      pubDate: new Date(
        naverBook.pubdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ),
      isbn: naverBook.isbn.split(" ")[0],
      description: naverBook.description.replace(/<[^>]*>/g, ""),
      price: naverBook.price,
      discount: naverBook.discount,
      category: null, // No category information from Naver API
      reviews: [], // No reviews from Naver API
    };

    res.json(transformedBook);
  } catch (error) {
    console.error("Get book by ISBN error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
