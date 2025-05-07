const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
app.use(cors());    // 모든 요청에 대해 CORS 사용
app.use(bodyParser.json());     //요청값을 json으로 해석

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'js1231!',
    database: 'test',
    connectionLimit: 5
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();

        // 이메일 중복 확인 (users.email UNIQUE로 지정했으므로!)
        const result = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (result.length > 0) {
            res.json({ success: false, message: '이미 존재하는 이메일입니다.' });
            return;
        }

        // 회원가입 진행
        await conn.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        res.json({ success: true, message: '회원가입 성공!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류: ' + err.message });  // 에러 메시지 추가
    } finally {
        if (conn) conn.release();
    }
});

//로그인 api
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    } finally {
        if (conn) conn.release();
    }
});

//팀 생성 api
function generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
  
  app.post('/teams', async (req, res) => {
    const { name, description, owner_id } = req.body;
    let invite_code = generateRandomCode();
    console.log('생성 invite_code:', invite_code);
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO team (name, invite_code, description, owner_id) VALUES (?, ?, ?, ?)',
        [name, invite_code, description, owner_id]
      );
      
      // BigInt 처리: insertId가 BigInt면 string으로 변환
      let team_id = result.insertId;
      if (typeof team_id === "bigint") {
        team_id = team_id.toString();
      }
      res.json({ success: true, invite_code, team_id });
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).json({ success: false, message: '팀 생성 오류', error: err.code });
    } finally {
      if (conn) conn.release();
    }
  });

  //팀 참가 api
  app.post('/joinTeam', async (req, res) => {
    const { invite_code, user_id } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
  
      // 1. 초대코드로 팀 찾기
      const rows = await conn.query(
        'SELECT * FROM team WHERE invite_code = ?', 
        [invite_code]
      );
  
      if (rows.length > 0) {
        const team_id = rows[0].id; // 찾은 팀의 id 가져오기
  
        // 이미 가입한 멤버인지 확인(중복방지, 선택)
        const already = await conn.query(
          'SELECT * FROM team_members WHERE team_id = ? AND user_id = ?', 
          [team_id, user_id]
        );
        if (already.length > 0) {
          res.json({ success: false, message: '이미 이 팀에 참가 중입니다!' });
          return;
        }
  
        // 2. team_members에 참가자 INSERT (team_id, user_id)
        await conn.query(
          'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', 
          [team_id, user_id]
        );
  
        // 3. 성공 응답
        res.json({ success: true, message: '팀 참가 완료!' });
      } else {
        // 초대코드로 팀 못찾음
        res.json({ success: false, message: '초대코드가 잘못됐어요.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: '서버 오류' });
    } finally {
      if (conn) conn.release();
    }
  });

// 마이페이지용: 내가 만든 팀과 참여팀 모두 반환
app.get('/my-teams-and-created', async (req, res) => {
  const user_id = req.query.user_id;
  let conn;
  try {
    conn = await pool.getConnection();

    // 내가 만든 팀 (owner_id=내id)
    const created_teams = await conn.query(
      'SELECT * FROM team WHERE owner_id = ?',
      [user_id]
    );

    // 내가 참여한 팀 (team_members에서 user_id로 join)
    const joined_teams = await conn.query(`
      SELECT t.id, t.name, t.description, t.invite_code
      FROM team_members tm
      JOIN team t ON tm.team_id = t.id
      WHERE tm.user_id = ?
    `, [user_id]);

    res.json({ success: true, created_teams, joined_teams });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});


app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});