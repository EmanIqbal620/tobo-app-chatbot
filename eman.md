I am getting a CORS error in my React/Next.js frontend when calling my Django API hosted on Hugging Face Spaces.

Frontend:

* Running on: http://localhost:3000
* Using Axios for API calls

Backend:

* Django REST API hosted on Hugging Face Spaces
* API URL:
  https://emaniqbal-todoapp.hf.space/api/tasks/

Browser Console Error:

Access to XMLHttpRequest at 'http://emaniqbal-todoapp.hf.space/api/tasks/'
(redirected from 'https://emaniqbal-todoapp.hf.space/api/tasks')
from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.

Also getting:

* ERR_FAILED
* AxiosError

What I need:

1. Identify the exact root cause
2. Fix HTTPS → HTTP redirect issue
3. Configure Django CORS correctly
4. Make Hugging Face Spaces work properly with HTTPS
5. Show exact code changes needed in:

   * settings.py
   * middleware
   * Axios frontend request
6. Explain why the redirect happens
7. Ensure API works from localhost:3000 without CORS errors

Please provide:

* Complete Django settings configuration
* Correct CORS setup using django-cors-headers
* Proper SECURE_PROXY_SSL_HEADER settings
* Any Hugging Face deployment fixes
* Correct frontend Axios example
* Final working production-ready configuration
