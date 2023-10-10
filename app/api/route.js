import { NextResponse } from "next/server";
import { graphqlHandler } from "./data/graphql/main";

export async function GET(request) {
    return graphqlHandler(request);
}

export async function POST(request) {
    return graphqlHandler(request);
}
