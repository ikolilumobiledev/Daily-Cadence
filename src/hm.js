const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: 'devuser01',
  host: '172.29.18.103',
  database: 'visitorslog',
  password: 'devuser0124',
  port: 5432,
  logging: false 
});

// Table 1: users_table
class UsersTable extends Model {}
UsersTable.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  branch: { type: DataTypes.STRING(100), allowNull: true },
  branch_code: { type: DataTypes.STRING(50), allowNull: true },
  role: { type: DataTypes.STRING(50), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  sequelize, 
  modelName: 'UsersTable', 
  tableName: 'users_table',
  timestamps: false 
});

// Table 2: fnb_branches
class FnbBranches extends Model {}
FnbBranches.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  sequelize, 
  modelName: 'FnbBranches', 
  tableName: 'fnb_branches',
  timestamps: false
});

// Table 3: admin_users - Use PostgreSQL ARRAY type to store as actual array
class AdminUsers extends Model {}
AdminUsers.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  branches: { type: DataTypes.ARRAY(DataTypes.STRING) }, // PostgreSQL array - will be returned as JS array
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_login: { type: DataTypes.DATE, allowNull: true }
}, { 
  sequelize, 
  modelName: 'AdminUsers', 
  tableName: 'admin_users',
  timestamps: false
});

// Table 4: visitor_log - Fixed to match original table structure
class VisitorLog extends Model {}
VisitorLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   date: { type: DataTypes.DATEONLY, allowNull: false }, // DATE type
  timein: { type: DataTypes.TIME, allowNull: false }, // TIME type (changed from 'timeIn')
  timeout: { type: DataTypes.TIME, allowNull: true }, // TIME type (changed from 'timeOut')
  department: { type: DataTypes.STRING(100), allowNull: true },
  company: { type: DataTypes.STRING(100), allowNull: true },
  picture: { type: DataTypes.TEXT, allowNull: true }, // Store file path or base64
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  reason: { type: DataTypes.TEXT, allowNull: true },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  name: { type: DataTypes.STRING(100), allowNull: true },
  branch: { type: DataTypes.STRING(50), allowNull: true },
  branchname: { type: DataTypes.STRING(100), allowNull: true } // Changed from 'branchName'
}, { 
  sequelize, 
  modelName: 'VisitorLog', 
  tableName: 'visitor_log',
  timestamps: false
});

// Optional: Define relationships if needed
// FnbBranches.hasMany(UsersTable, { foreignKey: 'branch_code', sourceKey: 'branch_code' });
// FnbBranches.hasMany(VisitorLog, { foreignKey: 'branch', sourceKey: 'branch_code' });

// Auto-create all tables function
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // This creates all 4 tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All 4 tables created successfully:');
    console.log('   - users_table');
    console.log('   - fnb_branches');
    console.log('   - admin_users');
    console.log('   - visitor_log');
    
    // Insert default branches data
    await seedBranches();
    
    // Insert default admin user
    await seedAdminUser();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Seed branches data
async function seedBranches() {
  try {
    const branchesData = [
      { branch_name: 'ACCRA BRANCH', branch_code: '330102' },
      { branch_name: 'MAKOLA BRANCH', branch_code: '330111' },
      { branch_name: 'TEMA BRANCH (COMM', branch_code: '330120' },
      { branch_name: 'AIRPORT BRANCH', branch_code: '330119' },
      { branch_name: 'MARKET CIRCLE BRANCH TAKORADI', branch_code: '330401' },
      { branch_name: 'ADUM BRANCH KUMASI', branch_code: '330601' },
      { branch_name: 'WEST HILLS MALL', branch_code: '330108' },
      { branch_name: 'JUNCTION SHOPPING CENTRE BRANCH', branch_code: '330101' },
      { branch_name: 'TEMA BRANCH (COMM 11)', branch_code: '330112' },
      { branch_name: 'ACHIMOTA MALL BRANCH', branch_code: '330107' },
      { branch_name: 'ACCRA MALL BRANCH', branch_code: '330106' },
      { branch_name: 'KEJETIA BRANCH', branch_code: '330602' }
    ];
    
    // Insert branches (only if they don't exist)
    for (const branch of branchesData) {
      const [branchRecord, created] = await FnbBranches.findOrCreate({
        where: { branch_code: branch.branch_code },
        defaults: branch
      });
      
      if (created) {
        console.log(`✅ Added branch: ${branch.branch_name}`);
      }
    }
    
    console.log('✅ All branches seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
  }
}

// Seed admin user using raw SQL to ensure compatibility with authController
async function seedAdminUser() {
  try {
    const allBranches = [
      'ACCRA BRANCH',
      'MAKOLA BRANCH',
      'TEMA BRANCH (COMM',
      'AIRPORT BRANCH',
      'MARKET CIRCLE BRANCH TAKORADI',
      'ADUM BRANCH KUMASI',
      'WEST HILLS MALL',
      'JUNCTION SHOPPING CENTRE BRANCH',
      'TEMA BRANCH (COMM 11)',
      'ACHIMOTA MALL BRANCH',
      'ACCRA MALL BRANCH',
      'KEJETIA BRANCH'
    ];
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password12345', salt);
    
    // Use raw SQL to insert admin user with PostgreSQL array syntax
    const insertQuery = `
      INSERT INTO admin_users (email, password, branches, role, created_at) 
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    
    const result = await sequelize.query(insertQuery, {
      replacements: [
        'admin@fnb.com',
        hashedPassword,
        allBranches, // PostgreSQL will handle this as an array
        'admin'
      ],
      type: Sequelize.QueryTypes.INSERT
    });
    
    if (result[1] > 0) { // result[1] is the number of affected rows
      console.log('✅ Default admin user created');
      console.log(`   Email: admin@fnb.com`);
      console.log(`   Password: password12345`);
      console.log(`   Branches: ${allBranches.length} branches assigned`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

// Export everything
module.exports = {
  sequelize,
  UsersTable,
  FnbBranches,
  AdminUsers,
  VisitorLog,
  initDatabase
};



//mmg

const login = async (req, res) => {
  const { email, password, branch } = req.body;

  try {
    console.log(`Login attempt: ${email} for branch ${branch}`);

    if (!email || !password || !branch) {
      return res.status(400).json({ error: 'Email, password, and branch are required' });
    }

    const adminResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    let user = adminResult.rows[0];
    let userTable = 'admin_users';

    if (!user) {
      const userResult = await pool.query(
        'SELECT * FROM users_table WHERE email = $1',
        [email]
      );
      user = userResult.rows[0];
      userTable = 'users_table';
    }

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // FIX: Handle branches parsing for admin users
    let userBranches = [];
    if (userTable === 'admin_users') {
      try {
        userBranches = user.branches ? JSON.parse(user.branches) : [];
      } catch (parseError) {
        console.error('Error parsing branches JSON:', parseError);
        userBranches = [];
      }
    } else {
      userBranches = [user.branch];
    }

    if (!userBranches.includes(branch)) {
      console.log(`User ${email} attempted to access unauthorized branch: ${branch}`);
      return res.status(403).json({ error: 'You do not have access to this branch' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user_id: user.id,
      email: user.email,
      branch: branch,
      role: user.role || 'user',
      user_table: userTable
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        branch: branch,
        role: user.role || 'user',
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// In your authController.js
const verifyAdminCredentials = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    const adminResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    const user = adminResult.rows[0];

    if (!user) {
      console.log(`Admin not found: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid password for admin: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // FIX: Parse the JSON string back to an array
    let branches = [];
    try {
      branches = user.branches ? JSON.parse(user.branches) : [];
    } catch (parseError) {
      console.error('Error parsing branches JSON:', parseError);
      branches = [];
    }

    const tempToken = jwt.sign({ 
      user_id: user.id,
      email: user.email,
      role: user.role || 'admin',
      temp: true 
    }, JWT_SECRET, { expiresIn: '5m' });

    return res.json({
      success: true,
      token: tempToken,
      branches: branches.map(branch => ({ branchName: branch, branchCode: branch })) 
    });

  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(500).json({ success: false, error: 'Server error during verification' });
  }
};


//rregis
const result = await pool.query(
  'INSERT INTO admin_users (email, password, branches, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, role, created_at',
  [email, hashedPassword, JSON.stringify(branches), role || 'user'] // Convert array to JSON string
);