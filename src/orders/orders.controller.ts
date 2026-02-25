import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto } from './dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PaginationDto } from 'src/common';
import { OrderStatus } from './enum/order.enum';
import { StatusDto } from './dto/status.dto';


@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send("createOrder", createOrderDto).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }

  @Get()
  findAllById(@Query() pagination: OrderPaginationDto) {
    return this.ordersClient.send("findAllOrders", pagination).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    );
  }


  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send("findOneOrder", {id}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }

  @Get(":status")
  findAllByStatus(@Query() paginationDto: PaginationDto, @Param() statusDto: StatusDto) {
    return this.ordersClient.send("findAllOrdersByStatus", {paginationDto, statusDto}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    );
  }

  @Patch(":id")
  changeOrderStatus(@Param("id", ParseUUIDPipe) id: string, @Body() UpdateOrderDto: StatusDto) {
    return this.ordersClient.send("changeOrderStatus", {id, status: UpdateOrderDto.status}).pipe(
      catchError(error=>{
        throw new RpcException(error)
      })
    )
  }
}
