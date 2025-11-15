#!/bin/bash

# Test script for Spark Backend API

BASE_URL="http://localhost:3001"

echo "🧪 Testing Spark Backend API"
echo "================================"
echo ""

# Health check
echo "1. Health Check:"
curl -s "$BASE_URL/api/health" | jq .
echo ""
echo ""

# YouTube - Most Popular
echo "2. YouTube - Most Popular (no query):"
curl -s "$BASE_URL/api/youtube/top?maxResults=5" | jq '.success, .count, .data[0]'
echo ""
echo ""

# YouTube - Search
echo "3. YouTube - Search (with query):"
curl -s "$BASE_URL/api/youtube/top?q=music+production&maxResults=5" | jq '.success, .count, .data[0]'
echo ""
echo ""

# Twitch - Top Streams
echo "4. Twitch - Top Streams (no game filter):"
curl -s "$BASE_URL/api/twitch/top?maxResults=5" | jq '.success, .count, .data[0]'
echo ""
echo ""

# Twitch - By Game
echo "5. Twitch - Filter by Game:"
curl -s "$BASE_URL/api/twitch/top?game=Just+Chatting&maxResults=5" | jq '.success, .count, .data[0]'
echo ""
echo ""

echo "✅ Tests complete!"

