import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/userModel';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

// to check against provided user id in case frontend doesn't provide or provides invalid id (PATCH)
const ObjectId = require('mongoose').Types.ObjectId;

export const GET = async () => {
  try {
    await connectDB();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Failed fetching users: ' + error.message, {
      status: 500,
    });
    console.log(error);
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    await connectDB();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({
        message: 'New user successfully created',
        user: newUser,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse('Failed creating new users: ' + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request) => {
  try {
    // we could get the id from params OR the body (here from the body)
    const body = await req.json();
    const { userId, newUsername } = body;

    await connectDB();

    // error handling in case id invalid
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: 'ID or username not found' }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid user ID' }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: 'User not found in the database',
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: 'User successfully updated',
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse('Failed updating user: ' + error.message, {
      status: 500,
    });
  }
};

export async function DELETE(req: Request) {
  try {
    // const body = await req.json();
    // const { userId } = body;
    // we could get the id from the body OR searchparams
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'ID not found' }), {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid user ID' }), {
        status: 400,
      });
    }

    await connectDB();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({
          message: 'User not found in the database',
        }),
        { status: 400 }
      );
    }
    return NextResponse.json(
      JSON.stringify({
        message: 'User deleted successfully',
        user: deletedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse('Failed deleting user: ' + error.message, {
      status: 500,
    });
  }
}
