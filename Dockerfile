FROM node:18
WORKDIR /app
ENV NEXT_PUBLIC_API_URL=https://emaniqbal-phase-3-chatbot.hf.space
ENV PORT=7860
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 7860
CMD ["npm", "run", "start"]