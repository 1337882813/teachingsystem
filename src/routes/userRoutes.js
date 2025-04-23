import express from 'express'
const router = express.Router()

export default function (pool) {
  // 登录接口
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body
      // 使用参数化查询防止SQL注入
      const result1 = await pool.query(
        'SELECT xh,pwd,xm,role FROM S WHERE xh = $1 AND pwd = $2',
        [username, password]
      )
      const result2 = await pool.query(
        'SELECT gh,pwd,xm,role FROM T WHERE gh = $1 AND pwd = $2',
        [username, password]
      )
      // 验证查询结果
      if (result1.rows.length > 0) {
        res.json({ success: true, user: result1.rows[0] })
      }
      else if (result2.rows.length > 0) {
        res.json({ success: true, user: result2.rows[0] })
      }
      else {
        res.status(401).json({ success: false, message: '用户名或密码错误' })
      }
    } catch (error) {
      console.error('数据库错误:', error)
      res.status(500).json({ success: false, message: '服务器内部错误' })
    }
  })
  //学生接口
  router.post('/students', async (req, res) => {
    try {
      const { course,studentId } = req.body
      // 使用参数化查询防止SQL注入
      const result = await pool.query(
        `SELECT C.kh,C.km, C.xf, T.gh, T.xm, O.sksj, O.xq,C.yxh, O.wz, COUNT(E.xh) AS skrs,EXISTS(
          SELECT 1 FROM E 
          WHERE E.xh = $2 AND E.kh = C.kh AND E.gh = T.gh
        ) AS isSelected
         FROM E
         JOIN O ON O.kh = E.kh AND O.gh = E.gh
         JOIN C ON O.kh = C.kh
         JOIN T ON O.gh = T.Gh
         WHERE C.km = $1 or C.kh = $1
         GROUP BY C.kh,C.km, C.xf, T.gh, T.xm, O.sksj,O.xq, C.yxh, O.wz`,
        [course,studentId]
      )
      // 验证查询结果
      if (result.rows.length > 0) {
         res.json({ success: true, data: result.rows })
      }
      else {
        res.status(401).json({ success: false, message: '未知课程' })
        console.log('未知课程')
      }
    } catch (error) {
      console.error('数据库错误:', error)
      res.status(500).json({ success: false, message: '服务器内部错误' })
    }
  })
  //选课接口
  router.post('/select', async (req, res) => {
    try{
      const{xh,xq,kh,gh,cj,sksj}=req.body; 
      // 使用参数化查询防止SQL注入
        const result=await pool.query(
        `select  * from e  join O on O.kh=E.kh and O.gh=E.gh 
         where
        (xh=$1 and E.kh = $2) or (xh= $1 and sksj=$3)`,
        [xh,kh, sksj]
      );
      if(result.rows.length>0){
        res.json({ success: false, message: '已选此课或时间冲突' })
        return;
      }
      await pool.query(
        `INSERT INTO E (xh, xq, kh, gh, cj) VALUES ($1, $2, $3, $4, $5)`,
        [xh, xq, kh, gh, cj]
      );
      res.json({ success: true, message: '选课成功' })
    }
     catch (error) {
      console.error('数据库错误:', error)
      res.status(500).json({ success: false, message: '服务器内部错误' })
  }})

  //退课接口
  router.post('/delete', async (req, res) => {
      try{
        const{xh,xq,kh,gh}=req.body; 
        // 使用参数化查询防止SQL注入
        await pool.query(
          `delete from E where xh=$1 and xq=$2 and kh=$3 and gh=$4`,
          [xh, xq, kh, gh]
        );
        res.json({ success: true, message: '退课成功' })
      }
       catch (error) {
        console.error('数据库错误:', error)
        res.status(500).json({ success: false, message: '服务器内部错误' })
  }})

  //查询已选课程接口
  router.post('/selected', async (req, res) => {
    try {
      const { studentId } = req.body
        // 使用参数化查询防止SQL注入
        const result = await pool.query(
          `SELECT C.kh,C.km, C.xf, T.gh, T.xm, O.sksj, O.xq,C.yxh, O.wz
          FROM E
          JOIN O ON O.kh = E.kh AND O.gh = E.gh
          JOIN C ON O.kh = C.kh
          JOIN T ON O.gh = T.Gh
          WHERE xh = $1
          GROUP BY C.kh,C.km, C.xf, T.gh, T.xm, O.sksj,O.xq, C.yxh, O.wz`,
          [studentId]
        )
        // 验证查询结果
        if (result.rows.length > 0) {
          res.json({ success: true, data: result.rows })
        // 输出查询结果到控制台，方便调试
        }
        else {
          res.status(401).json({ success: false, message: '未知课程' })
          console.log('未知课程')
        }
      } catch (error) {
        console.error('数据库错误:', error)
        res.status(500).json({ success: false, message: '服务器内部错误' })
      }
  })
     
  //查询成绩接口
  router.post('/scores', async (req, res) => {
        try {
          const { studentId } = req.body
            // 使用参数化查询防止SQL注入
            const result = await pool.query(
              `SELECT C.kh,C.km, C.xf, E.cj
              FROM E
              JOIN O ON O.kh = E.kh AND O.gh = E.gh
              JOIN C ON O.kh = C.kh
              WHERE xh = $1
              GROUP BY C.kh,C.km, C.xf,E.cj`,
              [studentId]
            )
            // 验证查询结果
            if (result.rows.length > 0) {
              res.json({ success: true, data: result.rows })
            // 输出查询结果到控制台，方便调试
            }
            else {
              res.status(401).json({ success: false, message: '未知课程' })
              console.log('未知课程')
            }
          } catch (error) {
            console.error('数据库错误:', error)
            res.status(500).json({ success: false, message: '服务器内部错误' })
          }
  })
    
      return router
}