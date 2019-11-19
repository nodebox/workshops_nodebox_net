import json

posts = json.load(open('posts.json'))
assets = list(json.load(open('assets.json')))
users = json.load(open('users.json'))
blogs = json.load(open('blogs.json'))

for blog in blogs:
    blog_posts = [post for post in posts if post['blog_id'] == blog['id']]
    blog_posts.reverse()
    for post in blog_posts:
        try:
            first_asset = [asset for asset in assets if asset['post_id'] == post['id']][0]
            break
        except IndexError:
            pass
    page = ''
    page += '---\n'
    page += 'layout: workshop\n'
    page += 'name: {}\n'.format(blog['name'])
    page += 'slug: {}\n'.format(blog['slug'])
    page += 'description: "{}"\n'.format(blog['description'].replace('"', ''))
    page += 'thumb: {}/{}\n'.format(blog['slug'], first_asset['file_name'])
    page += '---\n'
    page += blog['about']
    filename = '../_workshops/{}.md'.format(blog['slug'])
    open(filename, 'w').write(page)

for post in posts[:10]:
    user = [user for user in users if user['id'] == post['user_id']][0]
    blog = [blog for blog in blogs if blog['id'] == post['blog_id']][0]
    post_assets = []
    post_assets = list([asset for asset in assets if asset['post_id'] == post['id']])
    post_assets.sort(key=lambda x:x['position'])

    if len(post['body'].strip()) == 0 and len(post_assets) == 0: continue

    page = ''
    page += '---\n'
    page += 'layout: post\n'
    page += 'title: "{}"\n'.format(post['title'])
    page += 'workshop_name: {}\n'.format(blog['name'])
    page += 'workshop_slug: {}\n'.format(blog['slug'])
    page += 'categories: [{}]\n'.format(blog['slug'])
    page += 'author: {} {}\n'.format(user['first_name'], user['last_name'])
    if len(post_assets) > 0:
        page += 'assets:\n'
        for asset in post_assets:
            page += '  -\n'
            page += '    filename: {}\n'.format(asset['file_name'])
            page += '    type: {}\n'.format(asset['type'])
            if (len(asset['description'].strip()) > 0):
                page += '    description: {}\n'.format(asset['description'])
    page += '---\n'
    page += post['body']
    page += '\n'

    filename = '../_posts/{}-{}.md'.format(post['pub_date'], post['slug'])
    open(filename, 'w').write(page)
    