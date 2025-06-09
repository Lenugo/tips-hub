#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Verifying configuration for Render deployment...${NC}"

# Check Dockerfile.render
echo -n "Checking Dockerfile.render... "
if [ -f "Dockerfile.render" ]; then
    if grep -q "FROM node:20-alpine" Dockerfile.render && \
        grep -q "WORKDIR /app" Dockerfile.render && \
        grep -q "EXPOSE 4000" Dockerfile.render; then
        echo -e "${GREEN}✅ Valid${NC}"
    else
        echo -e "${RED}❌ Invalid structure${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Missing${NC}"
    exit 1
fi

# Check render.yaml
echo -n "Checking render.yaml... "
if [ -f "render.yaml" ]; then
    if grep -q "dockerfilePath: ./Dockerfile.render" render.yaml && \
        grep -q "healthCheckPath: /api/health" render.yaml; then
        echo -e "${GREEN}✅ Valid${NC}"
    else
        echo -e "${RED}❌ Invalid configuration${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Missing${NC}"
    exit 1
fi

# Check backend structure
echo -n "Checking backend structure... "
if [ -d "backend" ] && [ -f "backend/package.json" ] && [ -d "backend/src" ]; then
    echo -e "${GREEN}✅ Valid${NC}"
else
    echo -e "${RED}❌ Invalid backend structure${NC}"
    exit 1
fi

# Check package.json in backend
echo -n "Checking backend package.json... "
if [ -f "backend/package.json" ]; then
    if grep -q '"build"' backend/package.json; then
        echo -e "${GREEN}✅ Has build script${NC}"
    else
        echo -e "${RED}❌ Missing build script${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Missing${NC}"
    exit 1
fi

# Check for sensitive data in render.yaml
echo -n "Checking for sensitive data in render.yaml... "
if grep -i "mongodb+srv\|password\|secret.*=" render.yaml > /dev/null; then
    echo -e "${RED}❌ Found sensitive data! Remove it!${NC}"
    echo "Found:"
    grep -i "mongodb+srv\|password\|secret.*=" render.yaml
    exit 1
else
    echo -e "${GREEN}✅ No sensitive data found${NC}"
fi

# Check git status
echo -n "Checking git status... "
if git status > /dev/null 2>&1; then
    if git diff-index --quiet HEAD --; then
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    else
        echo -e "${YELLOW}⚠️  Has uncommitted changes${NC}"
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}🎉 Configuration verification completed!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "• Dockerfile.render: ${GREEN}Ready${NC}"
echo -e "• render.yaml: ${GREEN}Ready${NC}" 
echo -e "• Backend structure: ${GREEN}Ready${NC}"
echo -e "• Security check: ${GREEN}Passed${NC}"
echo ""
echo -e "${YELLOW}Ready for deployment!${NC}"
echo "Run: ./deploy-to-render.sh"