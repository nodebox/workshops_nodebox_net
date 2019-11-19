import csv
import json

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import sessionmaker
Base = declarative_base()

class Blog(Base):
    __tablename__ = 'blog_blogs'

    id = Column(Integer, primary_key = True)
    name = Column(String)
    slug = Column(String)
    description = Column(String)
    about = Column(String)
    position = Column(Integer)

class Post(Base):
    __tablename__ = 'blog_posts'

    id = Column(Integer, primary_key = True)
    blog_id = Column(Integer)
    user_id = Column(Integer)
    title = Column(String)
    slug = Column(String)
    pub_date = Column(Date)
    body = Column(String)

class Asset(Base):
    __tablename__ = 'blog_assets'

    id = Column(Integer, primary_key = True)
    post_id = Column(Integer)
    file_name = Column(String)
    type = Column(String)
    description = Column(String)
    position = Column(Integer)

class User(Base):
    __tablename__ = 'auth_user'

    id = Column(Integer, primary_key = True)
    username = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)

engine = create_engine('mysql+mysqldb://root:eee55dd@localhost/workshops', echo=True)
Session = sessionmaker(bind=engine)
session = Session()

out_blogs = []
blogs = session.query(Blog)
for blog in blogs:
    print(blog.id, blog.name)
    out_blogs.append({'id': blog.id, 'name': blog.name, 'slug': blog.slug, 'description': blog.description, 'about': blog.about, 'position': blog.position})
json.dump(out_blogs, open('blogs.json', 'w'))

out_posts = []
posts = session.query(Post)
for post in posts:
    pub_date = '{}-{:02d}-{:02d}'.format(post.pub_date.year, post.pub_date.month, post.pub_date.day)
    out_posts.append({'id': post.id, 'blog_id': post.blog_id, 'user_id': post.user_id, 'title': post.title, 'slug': post.slug, 'pub_date': pub_date, 'body': post.body})
json.dump(out_posts, open('posts.json', 'w'))

out_assets = []
assets = session.query(Asset)
for asset in assets:
    out_assets.append({'id': asset.id, 'post_id': asset.post_id, 'file_name': asset.file_name, 'type': asset.type, 'description': asset.description, 'position': asset.position})
json.dump(out_assets, open('assets.json', 'w'))

out_users = []
users = session.query(User)
for user in users:
    out_users.append({'id': user.id, 'username': user.username, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email})
json.dump(out_users, open('users.json', 'w'))
