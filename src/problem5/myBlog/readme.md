# MyBlog Blockchain Commands

This README provides a step-by-step guide to setting up and managing posts on the **MyBlog** blockchain using `myBlogd`. The commands cover creating, updating, listing, and deleting blog posts.

## **Prerequisites**
Ensure that you have installed and configured `ignite` and `myBlogd` correctly.

## **1️⃣ Set Up the Environment**
Before running blockchain commands, update your system's `PATH` to include the Go binary location:

First, find the path of `myBlogd`:

```sh
find ~/go -name "myBlogd"
```

Then, update your `.zshrc` file:

```sh
nano ~/.zshrc
```

Add the following line, replacing `/path/to/myBlogd` with the actual path found in the previous step:

```sh
export PATH=$PATH:/path/to/myBlogd
```

Then, reload the shell configuration:

```sh
source ~/.zshrc
```

## **2️⃣ Verify Installation**
Check if `myBlogd` is installed and accessible:

```sh
myBlogd
```

If `myBlogd` is found, you can proceed.

## **3️⃣ Create a Post**
To create a blog post with the title `hello` and content `world` using Alice's account:

```sh
myBlogd tx myblog create-post "hello" "world" --from alice --chain-id myBlog
```

## **4️⃣ View a Post**
Retrieve and display the post with ID `0`:

```sh
myBlogd q myblog show-post 0
```

## **5️⃣ Update a Post**
Modify the post with ID `0` to change its title to `Hello` and content to `Cosmos`:

```sh
myBlogd tx myblog update-post "Hello" "Cosmos" 0 --from alice --chain-id myBlog
```

Verify the update:

```sh
myBlogd q myblog show-post 0
```

## **6️⃣ Create Another Post (Using Bob's Account)**
Bob creates a second post titled `2nd post` with content `sent by bob`:

```sh
myBlogd tx myblog create-post "2nd post" "sent by bob" --from bob --chain-id myBlog
```

Retrieve Bob's post (ID `1`):

```sh
myBlogd q myblog show-post 1
```

## **7️⃣ List All Posts**
To view all existing posts:

```sh
myBlogd q myblog list-post true
```

## **8️⃣ Delete a Post**
Alice deletes the post with ID `0`:

```sh
myBlogd tx myblog delete-post 0 --from alice --chain-id myBlog
```

Confirm the remaining posts:

```sh
myBlogd q myblog list-post true
```

---

## **📌 Notes**
- Ensure that Alice and Bob have sufficient tokens to execute transactions.
- Posts are referenced by their unique IDs (`0`, `1`, etc.).
- If any command fails, ensure your node is running with `myBlogd start`.

### **🎯 Now you're ready to interact with MyBlog blockchain! 🚀**

