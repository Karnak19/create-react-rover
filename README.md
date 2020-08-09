# CREATE-REACT-ROVER

bootstrapper CLI for React App with basic conf for Caprover deployment.

It uses [Parcel](https://parceljs.org/) as bundler

## Getting started

You can install it globally OR use npx instead

```bash
npx create-react-rover my-fresh-app

cd my-fresh-app

npm run dev

```

After each push to `master`, GitHub Action will build the app and pushing it to a `production` branch.

**BUT** actually, it doesn't create the Caprover config files on that branch, you have to do it on your own, following this :

```bash
# Create your GitHub repo and link it...
git push -u origin master

# Wait for the action to perform and create production branch
git fetch --all

git checkout production

# copy Dockerfile, captain-definition and default.conf from master branch

git add Dockerfile captain-definition default.conf
git commit -m "youhou, basic config added !"
git push -u origin production

```

Then setup your Caprover app
![](https://i.imgur.com/v7zrDoK.png)

## GitHub Actions

The template project use GitHub Actions for two things:

- Running ESLint on Pull Request on `master` and `dev`
- Building the app and push it to a `production` branch once code is merged on `master`

If you do not want to use the `production` branch with the build action, to let your Caprover instance building it, **you can delete the `build.yml` file** and replace original Dockerfile with this one :

_(This one just add an automatic build command)_

```Dockerfile
# build environment
FROM node:12 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app
RUN npm install
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
