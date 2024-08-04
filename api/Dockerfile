FROM golang:1.22-bookworm

WORKDIR /app

COPY go.mod /app/
RUN go mod download
RUN go mod tidy

COPY . /app/
RUN go build -o capstone_server

RUN chmod +x /app/capstone_server
ENTRYPOINT [ "/app/capstone_server" ]