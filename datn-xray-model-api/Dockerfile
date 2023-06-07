FROM python:3.8
WORKDIR /app
COPY . .
RUN apt-get -y update
RUN apt-get update && apt-get install -y python3 python3-pip
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
CMD ["python3", "main.py"]