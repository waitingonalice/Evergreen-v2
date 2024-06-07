#!/bin/bash

echo "Setting up environment variables"
{
  echo "NEXT_PUBLIC_ENDPOINT_URL=$NEXT_PUBLIC_ENDPOINT_URL"
} >>./frontend/.env
