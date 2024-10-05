<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <NuxtLink to="/">Go back home</NuxtLink>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 100px;
  }
  
  h1 {
    font-size: 48px;
    color: #ff4040;
  }
  
  p {
    font-size: 18px;
    color: #555;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  