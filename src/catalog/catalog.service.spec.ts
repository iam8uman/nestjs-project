import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CatalogService', () => {
  let service: CatalogService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: '',
        stock: 0,
        images: [],
        categoryId: 0,
      };
      (prismaService.product.create as jest.Mock).mockResolvedValue(
        createProductDto,
      );
      const result = await service.createProduct(createProductDto);
      expect(result).toEqual(createProductDto);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Test Product', price: 100 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue(products);
      const result = await service.findAllProducts();
      expect(result).toEqual(products);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        include: { category: true },
      });
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID', async () => {
      const product = { id: 1, name: 'Test Product', price: 100 };
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
        product,
      );
      const result = await service.findProductById(1);
      expect(result).toEqual(product);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { category: true },
      });
    });

    it('should return null if product not found', async () => {
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findProductById(1);
      expect(result).toBeNull();
    });
  });

  describe('filterProducts', () => {
    it('should filter products', async () => {
      const filterDto: FilterProductDto = {
        categoryId: 1,
        minPrice: 100,
        maxPrice: 1000,
        minRating: 5,
      };
      const products = [{ id: 1, name: 'Test Product', price: 100 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue(products);
      const result = await service.filterProducts(filterDto);
      expect(result).toEqual(products);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          categoryId: 1,
          price: { gte: 100, lte: 1000 },
          ratings: { gte: 5 },
        },
        include: { category: true },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };
      const updatedProduct = { id: 1, ...updateProductDto };
      (prismaService.product.update as jest.Mock).mockResolvedValue(
        updatedProduct,
      );
      const result = await service.updateProduct(1, updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateProductDto,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100 };
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
        product,
      );
      (prismaService.product.delete as jest.Mock).mockResolvedValue(product);
      const result = await service.deleteProduct(1);
      expect(result).toEqual(product);
      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteProduct(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
      (prismaService.category.create as jest.Mock).mockResolvedValue(
        createCategoryDto,
      );
      const result = await service.createCategory(createCategoryDto);
      expect(result).toEqual(createCategoryDto);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: { name: 'Test Category' },
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [{ id: 1, name: 'Test Category', products: [] }];
      (prismaService.category.findMany as jest.Mock).mockResolvedValue(
        categories,
      );
      const result = await service.getAllCategories();
      expect(result).toEqual(categories);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        include: { products: true },
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const category = { id: 1, name: 'Test Category', products: [] };
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(
        category,
      );
      const result = await service.getCategoryById(1);
      expect(result).toEqual(category);
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { products: true },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getCategoryById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const existingCategory = { id: 1, name: 'Old Category' };
      const updatedCategory = { id: 1, ...updateCategoryDto };

      // Mock the findUnique method to return an existing category
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(
        existingCategory,
      );
      // Mock the update method to return the updated category
      (prismaService.category.update as jest.Mock).mockResolvedValue(
        updatedCategory,
      );

      const result = await service.updateCategory(1, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Category' },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      // Mock the findUnique method to return null
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateCategory(1, { name: 'Updated Category' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const category = { id: 1, name: 'Test Category' };
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(
        category,
      );
      (prismaService.category.delete as jest.Mock).mockResolvedValue(category);
      const result = await service.deleteCategory(1);
      expect(result).toEqual({
        message: `Category with ID 1 deleted successfully`,
      });
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteCategory(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
