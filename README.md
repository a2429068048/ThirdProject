# ThirdProject

### 文档说明:

> 1. 静态文件放在static文件夹下。
> 2. 请求处理在router文件夹中对应的js进行处理
>    1. toPage文件是用来跳转的直接跳转模板页面的
> 3. 数据库的访问端口是27017，
> 4. 服务器的端口为3000
> 5. 数据库的名称叫做Flower
> 6. commend.html文件用来放置一些头部共同使用的东西。当前用来导入SUI的相关配置文件
> 7. script.html 文件用来放置一些共用script内容，放在</body>前面例如
``` 
    <div>sss</div>
    {{include "./script"}}
    <script>xxx<script>
    </body>
```