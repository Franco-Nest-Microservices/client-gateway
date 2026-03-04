import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto } from './dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PaginationDto } from 'src/common';
import { OrderStatus } from './enum/order.enum';
import { StatusDto } from './dto/status.dto';


@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send("createOrder", createOrderDto).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }

  @Get()
  findAllById(@Query() pagination: OrderPaginationDto) {
    return this.client.send("findAllOrders", pagination).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    );
  }


  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send("findOneOrder", {id}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }

  @Get(":status")
  findAllByStatus(@Query() paginationDto: PaginationDto, @Param() statusDto: StatusDto) {
    return this.client.send("findAllOrdersByStatus", {paginationDto, statusDto}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    );
  }

  @Patch(":id")
  changeOrderStatus(@Param("id", ParseUUIDPipe) id: string, @Body() UpdateOrderDto: StatusDto) {
    return this.client.send("changeOrderStatus", {id, status: UpdateOrderDto.status}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }
}
