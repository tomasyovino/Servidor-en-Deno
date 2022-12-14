import { Context, helpers, ObjectId } from "../../deps.ts";
import logger from "../middlewares/logger.ts";
import { Product } from "../types/products.type.ts";
import dbConn from "../middlewares/mongo.conn.ts";

const products = dbConn.collection<Product>('products');


export const findAll = async (ctx: Context) => {
  try {
      ctx.response.status = 200;
      logger.debug(`status: ${ctx.response.status} method: findAll handler`);

      const resProducts = await products.find({}).toArray();
      ctx.response.body = await {code: '00', data: resProducts};
  } catch (error) {
      ctx.response.status = 500;

      logger.error(`status: ${ctx.response.status} ${error}`);
      ctx.response.body = {code: '99', msg: error};
  }
}

export const findProduct = async (ctx: Context) =>{
  try {
      const { id } = helpers.getQuery(ctx, {mergeParams: true});
      const _id = new ObjectId(id);
      const product = await products.findOne({_id: _id})

      if (product) {
          ctx.response.body = await {code: '00', data: product};
      } else {
          ctx.response.body = await {code: '01', msg: `Producto con id ${id} no encontrado.`};
      }
  } catch (error) {
      ctx.response.status = 500;

      logger.error(`status: ${ctx.response.status} ${error}`);
      ctx.response.body = {code: '99', msg: error};
  }
}

export const createProduct = async (ctx: Context ) => {
  try {
      ctx.response.status = 201;
      logger.debug(`status: ${ctx.response.status} method: createProduct handler`);

      const { name, desc, price } = await ctx.request.body().value;

      const product: Product = {
          name: name,
          desc: desc,
          price: price
      }
      await products.insertOne(product);

      ctx.response.body = await {code: '00', data: product};
  } catch (error) {
      ctx.response.status = 500;

      logger.error(`status: ${ctx.response.status} ${error}`);
      ctx.response.body = {code: '99', msg: error};
  }
}

export const updateProduct = async (ctx: Context ) => {
  try {
      ctx.response.status = 202;
      logger.debug(`status: ${ctx.response.status} method: updateProduct handler`);

      const { id } = helpers.getQuery(ctx, {mergeParams: true});
      const _id = new ObjectId(id);
      const product = await products.findOne({_id: _id});

      if (product) {
          const { name, desc, price } = await ctx.request.body().value;
          await products.updateOne({_id: _id}, {$set: {name: name, desc: desc, price: price}})
          ctx.response.body = {code: '00', data: {_id: _id, name: name, desc: desc, price: price}} 
      } else {
          ctx.response.body = {code: '01', msg: `Producto con id ${_id} no encontrado.`};
      }
  } catch (error) {
      ctx.response.status = 500;

      logger.error(`status: ${ctx.response.status} ${error}`);
      ctx.response.body = {msg: error};
  }
}

export const deleteProduct = async (ctx: Context ) => {
  try {
      ctx.response.status = 200;
      logger.debug(`status: ${ctx.response.status} method: deleteProduct handler`);

      const { id } = helpers.getQuery(ctx, {mergeParams: true});
      const _id = new ObjectId(id);
      const product = await products.findOne({_id: _id});

      if (product) {
          await products.deleteOne({_id: _id});

          ctx.response.body = {code: '00', msg: `Producto con id ${_id} eliminado`} 
      } else {
          ctx.response.body = {code: '01', msg: `Producto con id ${_id} no encontrado.`};
      }
  } catch (error) {
      ctx.response.status = 500;

      logger.error(`status: ${ctx.response.status} ${error}`);
      ctx.response.body = {msg: error};
  }
}