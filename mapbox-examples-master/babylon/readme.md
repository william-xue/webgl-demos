###

1. 位置旋转
- 全局坐标系，局部坐标系
- Position, 旋转Rotation 和 缩放Scaling三个设置参数   均使用三维矢量分别设置，  BABYLON.Vector3（x，y，z）
- 通过使用变换节点TransformNode或矩阵Matrix来为物体设置新的支点
- X轴为红色，Y轴为绿色，Z轴为蓝色
- 链式调用旋转： mesh.addRotation(Math.PI/2, 0, 0).addRotation(0, Math.PI/2, 0).addRotation(0, 0, Math.PI/2);  一般来说，mesh.addRotation(alpha，beta，gamma)只对其中1个参数设置弧度制，剩下2个设为0

- requestAnimationFrame :   https://blog.csdn.net/weixin_44730897/article/details/116532510

2. 材质
漫反射 - 在灯光下看到的材质基本颜色或纹理
镜面反射 - 在灯光照射下，高光给与材质的效果
自发光 - 材质的颜色或纹理就像一个灯光那样可以对外发出效果
环境 - 环境背光所照射出来的材质颜色或纹理
 要看到漫反射和镜面反射的材质效果，必须要求创建至少一个光源。
要让环境背光照射出材质的环境颜色效果，还需要为场景设置一个环境颜色
