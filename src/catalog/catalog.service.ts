import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAllProducts() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async filterProducts(filterDto: FilterProductDto) {
    const { categoryId, minPrice, maxPrice, minRating } = filterDto;

    return this.prisma.product.findMany({
      where: {
        categoryId: categoryId ? categoryId : undefined,
        price: {
          gte: minPrice ? minPrice : undefined,
          lte: maxPrice ? maxPrice : undefined,
        },
        ratings: {
          gte: minRating ? minRating : undefined,
        },
      },
      include: { category: true },
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    // const product = await this.findProductById(id);

    return this.prisma.product.update({
      where: { id: Number(id) },
      data: updateProductDto,
    });
  }

  async deleteProduct(id: number) {
    const product = await this.findProductById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }

  // category start from here
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    return this.prisma.category.create({
      data: { name },
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        products: true, // To include associated products
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: `Category with ID ${id} deleted successfully` };
  }
}
