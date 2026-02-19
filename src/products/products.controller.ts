import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(){
    return "Crea un producto"
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
  deleteProduct(@Param("id") id:string){
    return `This function delete a product with id ${id}`
  }

  @Patch(":id")
  updateProduct(@Param("id") id: string, @Body() body: any){
    return `This function update a product with id ${id}`
  }
}
