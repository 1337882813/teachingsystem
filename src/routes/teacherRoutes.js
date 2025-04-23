import express from 'express';
const router = express.Router();

export default function (pool) {
    //我教的课程接口
    router.post('/myCourses', async (req, res) => {
        try{
            const { teacherId } = req.body; // 从请求体中获取教师ID
            // 使用参数化查询防止SQL注入
            const result = await pool.query(
               `SELECT C.kh,C.km, C.xf,T.xm, O.sksj, O.xq,O.wz, COUNT(E.xh) AS skrs
                FROM E
                JOIN O ON O.kh = E.kh AND O.gh = E.gh
                JOIN C ON O.kh = C.kh
                JOIN T ON O.gh = T.Gh
                WHERE T.gh = $1
                GROUP BY C.kh,C.km, C.xf, T.xm, O.sksj,O.xq, O.wz` // 查询教师教的课程
                ,[teacherId]
            )
            // 验证查询结果
            if (result.rows.length > 0) {
                res.json({ success: true, data: result.rows }) // 返回查询结果 
            }
            else {
                res.status(401).json({ success: false, message: '信息错误' }) // 如果没有课程，返回错误消息 
            }
        }catch (error) {
            console.error('数据库错误:', error);
            res.status(500).json({ success: false, message: '服务器内部错误' });
        }
    })
    //课程管理接口
    router.post('/courseManage', async (req, res) => {
        try{
            const { teacherId } = req.body; // 从请求体中获取教师ID
            // 使用参数化查询防止SQL注入
            const result = await pool.query(
               `SELECT C.kh,C.km,T.xm, O.sksj,O.xq, COUNT(E.xh) AS skrs
                FROM E
                JOIN O ON O.kh = E.kh AND O.gh = E.gh
                JOIN C ON O.kh = C.kh
                JOIN T ON O.gh = T.Gh
                WHERE T.gh = $1
                GROUP BY C.kh,C.km, T.xm, O.sksj,O.xq` // 查询教师教的课程
                ,[teacherId]
            )
            // 验证查询结果
            if (result.rows.length > 0) {
                res.json({ success: true, data: result.rows }) // 返回查询结果 
            }
            else {
                res.status(401).json({ success: false, message: '信息错误' }) // 如果没有课程，返回错误消息 
            }
        }catch (error) {
            console.error('数据库错误:', error);
            res.status(500).json({ success: false, message: '服务器内部错误' });
        }
    })


    return router;

}