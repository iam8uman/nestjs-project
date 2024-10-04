import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.catalogService.createProduct(createProductDto);
  }

  @Get('products')
  getAllProducts() {
    return this.catalogService.findAllProducts();
  }

  @Get('products/:id')
  getProductById(@Param('id') id: number) {
    return this.catalogService.findProductById(id);
  }

  @Get('filter')
  filterProducts(@Query() filterDto: FilterProductDto) {
    return this.catalogService.filterProducts(filterDto);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.catalogService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: number) {
    return this.catalogService.deleteProduct(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been created successfully.',
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.catalogService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  async getAllCategories() {
    return this.catalogService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category.' })
  async getCategoryById(@Param('id') id: number) {
    return this.catalogService.getCategoryById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been updated successfully.',
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.catalogService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been deleted.' })
  async deleteCategory(@Param('id') id: number) {
    return this.catalogService.deleteCategory(id);
  }
}
