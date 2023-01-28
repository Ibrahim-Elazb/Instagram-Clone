# Instagram Cloning API Project

## Overview

- website like Instagram you can upload and Post Pictures, Follow Others and add comments to others' posts.

## Table of Contents

- [Project Title](#project-title)
- [Overview](#overview)
- [Table of contents](#table-of-contents)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Contribute](#contribute)

## Usage

# Path to Sign Up (Registration of new user)

    /api/auth/signup/

# Path to login

    /api/auth/login/
	
# Path to Forget Password

    /api/auth/forget-password
	
# Path to reset Password

    /api/auth/reset-password

# Edit User Information

    /api/users/edit-my-information/

# Change Profile Picture

    /api/users/change-profile-picture/
	
# Change Cover Pictures

    /api/users/change-cover-pictures/
	
# Change User Password

    /api/users/change-password/
	
# Add Follow To User

    /api/users/add-follow/<followedId>
	
# Remove Follow Of User

    /api/users/remove-follow/<followedId>
	
# Show Profile Of User

    /api/users/show-profile/<userId>

# Add, Remove, Edit and get Posts

    /api/posts

# Add, Remove, Edit and get Comments

    /api/comments

# Path to admin to show all users

    /api/admin/show-all-users
	
# Block user by id

    /api/admin/blocking-user/<userId>
	
# Change Role of user

    /api/admin/change-role/<userId>

## Dependencies

- express
- joi
- jsonwebtoken
- mongoose
- multer
- qrcode
- @sendgrid/mail
- nodejs-nodemailer-outlook
- bcrypt
- cors
- crypto-js
- uuid

## Installation

- Use the Node package manager (NPM) to install express and other dependencies

## Contribute

Ibrahim Elazb
