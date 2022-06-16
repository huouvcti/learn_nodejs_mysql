var mysql = require('mysql');

// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1111',
  database : 'learn_nodejs_mysql'
});

connection.connect();

connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();

/* connection.query : 객체형태로 반환
[
  RowDataPacket {
    id: 1,
    title: 'MySQL',
    description: 'MySQL is...',
    created: 2018-01-01T03:10:11.000Z,
    author_id: 1
  },
  RowDataPacket {
    id: 2,
    title: 'Oracle',
    description: 'Oracle is ...',
    created: 2018-01-03T04:01:10.000Z,
    author_id: 1
  },
  RowDataPacket {
    id: 3,
    title: 'SQL Server',
    description: 'SQL Server is ...',
    created: 2018-01-20T02:01:10.000Z,
    author_id: 2
  },
  RowDataPacket {
    id: 4,
    title: 'PostgreSQL',
    description: 'PostgreSQL is ...',
    created: 2018-01-22T16:03:03.000Z,
    author_id: 3
  },
  RowDataPacket {
    id: 5,
    title: 'MongoDB',
    description: 'MongoDB is ...',
    created: 2018-01-30T03:31:03.000Z,
    author_id: 1
  }
]
*/
