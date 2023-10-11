
# Video Sharing Platform Like Forum/Youtube Backend With Node Js, Express, Mongo Db.

This project, is for building a video sharing server with live notification and full authentication and authorization based also.
Here, we will add like, dislike, comment, comment like, comment dislike, reply,  reply like, reply dislike feature.


## Features

- Full Authentication and Authorization based.
- Uploading video.
- Video Love React Add.
- Video Dislove React.
- Commenting.
- Comment Love React.
- Comment Dislove.
- Reply Adding In Comment.
- Reply Love React.
- Reply Dislove.
- All Realestic Animation with Framer Motion.
- Latest Anime or Movies Advertise at Homepage.
- Searching video with username who uploaded or by category type that is added in tag.
- Searching bar can search also based in the text.
- Bookmarking video to watch later.
- Showing Love reacted videos at a page.
- Category select and see videos based on it.
- Forget password will send mail with a password to use as temporary for user, this is done by nodemailer.
## Lessons Learned

- Node Js
- Express 
- React Redux
- React Redux Toolkit
- Framer Motion
- Nodemailer
- Multer
- Socket Io
- Jimp
- Mongo
- Joi
- Mongoose
- Cors
- Morgan
- Error Handling



## Run Locally

Clone the project

```bash
  https://github.com/SaminKirigaya/Video_Sharing_Platform_Backend_MERN_Stack.git

```

Go to the project directory

```bash
  cd my-project
  //your project saving directory name
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Cautions And Optimization

The most important thing which you must remember is that you have to change .env file and adjust it according to your hosting.I ran the project in localhost in port 8000.

During authentication checking time user send token in header authorization bearer and a user serial with link at url with them we go to database tokendb and check if both are having same username or not. We do not use your email and password after you login in order to make you safe. tokendb has token and a username based on the user. Serial indicates a name from main user Db. The whole process is in Authenticate middleware.

PORT=8000
SMTP_MAIL=gmailid with which u opened smtp 
SMTP_PASS=the pass which you got during smtp making
IMG=http://localhost:8000
DBURL=mongodb://0.0.0.0:27017/videohub


-   Port means which port to run it.
-   Imgpath is a link starting root address ... I used express.static to save image inside public/images.
so the image link was like :
http://localhost:8000/public/images/imagename.jpg


-   smtp_mail and smtp_pass are your smtp creation based provided one.

- Change DBURL's mongo db urls if you host in mongo atlas.

## Support

For support, saminyeasararnob@gmail.com 

