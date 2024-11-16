import dbConnect from '@/lib/db';
import Order from '@/models/order.model';
import Customer from '@/models/customer.model';
import { authenticate } from '@/lib/auth';

const createOrderHandler = async (req) => {
    const { product, quantity } = await req.json();
    
    await dbConnect();
  
    // Create a new order
    const order = new Order({
      product,
      quantity,
      customerId: req.userId, // Use authenticated user's ID
    });
  
    try {
      const savedOrder = await order.save();
  
      // Update the customer's orders array
      await Customer.findByIdAndUpdate(
        req.userId,
        { $push: { orders: savedOrder._id } }, // Push the new order ID into the orders array
        { new: true } // Return the updated document
      );
  
      return new Response(JSON.stringify(savedOrder), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  };
  
  export const POST = authenticate(createOrderHandler);