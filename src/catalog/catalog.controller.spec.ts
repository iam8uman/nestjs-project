import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  beforeEach(async () => {
    const mockCatalogService = {
      createProduct: jest.fn(),
      findAllProducts: jest.fn(),
      findProductById: jest.fn(),
      filterProducts: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      createCategory: jest.fn(),
      getAllCategories: jest.fn(),
      getCategoryById: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      await controller.createProduct(createProductDto);
      expect(service.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      await controller.getAllProducts();
      expect(service.findAllProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const id = 1;
      await controller.getProductById(id);
      expect(service.findProductById).toHaveBeenCalledWith(id);
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
      await controller.filterProducts(filterDto);
      expect(service.filterProducts).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const id = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };
      await controller.updateProduct(id, updateProductDto);
      expect(service.updateProduct).toHaveBeenCalledWith(id, updateProductDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const id = 1;
      await controller.deleteProduct(id);
      expect(service.deleteProduct).toHaveBeenCalledWith(id);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
      await controller.createCategory(createCategoryDto);
      expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      await controller.getAllCategories();
      expect(service.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const id = 1;
      await controller.getCategoryById(id);
      expect(service.getCategoryById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const id = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      await controller.updateCategory(id, updateCategoryDto);
      expect(service.updateCategory).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const id = 1;
      await controller.deleteCategory(id);
      expect(service.deleteCategory).toHaveBeenCalledWith(id);
    });
  });
});
