#!/bin/bash

echo "Setting up environment variables"
{
  echo "NEXT_PUBLIC_AUTH_ENDPOINT=$NEXT_PUBLIC_AUTH_ENDPOINT"
} >>./frontend/.env
