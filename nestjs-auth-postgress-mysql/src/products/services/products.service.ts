import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, Between } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll(params: FilterProductsDto) {
    if (params) {
      const where: FindConditions<Product> = {};
      const { limit, offset, maxPrice, minPrice } = params;

      if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);

      return this.productRepository.find({
        relations: ['brand'],
        where,
        take: limit,
        skip: offset,
      });
    }
    return this.productRepository.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;

    // Create only create instance of model
    const newProduct = this.productRepository.create(data);

    if (data.brandId) {
      newProduct.brand = await this.brandRepository.findOne(data.brandId);
    }

    if (data.categoriesId) {
      newProduct.categories = await this.categoryRepository.findByIds(
        data.categoriesId,
      );
    }

    return this.productRepository.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);

    if (changes.brandId) {
      product.brand = await this.brandRepository.findOne(changes.brandId);
    }

    if (changes.categoriesId) {
      product.categories = await this.categoryRepository.findByIds(
        changes.categoriesId,
      );
    }

    this.productRepository.merge(product, changes);

    return this.productRepository.save(product);
  }

  async removeCategoryInProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );

    return this.productRepository.save(product);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });
    const category = await this.categoryRepository.findOne(categoryId);

    product.categories.push(category);

    return this.productRepository.save(product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
