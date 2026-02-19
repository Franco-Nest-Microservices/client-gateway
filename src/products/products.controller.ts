import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.productsClient.send({cmd: "create"}, createProductDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto){
    return this.productsClient.send({cmd: "find_all"}, paginationDto)
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id:number){
    return this.productsClient.send({cmd: "find_one"}, {id}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete(":id")
  deleteProduct(@Param("id", ParseIntPipe) id:number){
    return this.productsClient.send({cmd: "delete"}, {id}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch(":id")
  updateProduct(@Param("id", ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto){
    return this.productsClient.send({cmd: "update"}, {...updateProductDto, id}).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}
