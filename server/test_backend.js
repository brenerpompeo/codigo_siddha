
async function runTests() {
  const baseUrl = 'http://localhost:3001';
  let userId;
  let taskId;

  console.log('--- Starting Backend Verification ---');

  // 1. Create User
  try {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `test_user_${Date.now()}` })
    });
    const data = await res.json();
    if (res.ok) {
        userId = data.id;
        console.log('✅ User created:', data);
    } else {
        console.error('❌ Failed to create user:', data);
        return;
    }
  } catch (e) {
      console.error('❌ Connection error:', e);
      return;
  }

  // 2. Create Task
  try {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Kill the Dragon',
        difficulty: 'Hard',
        user_id: userId
      })
    });
    const data = await res.json();
    if (res.ok) {
        taskId = data.id;
        console.log('✅ Task created:', data);
    } else {
        console.error('❌ Failed to create task:', data);
    }
  } catch (e) { console.error(e); }

  // 3. Update Task (Complete)
  try {
    const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Done' })
    });
    const data = await res.json();
    if (res.ok && data.status === 'Done') {
        console.log('✅ Task updated to Done:', data);
    } else {
        console.error('❌ Failed to update task:', data);
    }
  } catch (e) { console.error(e); }

  // 4. Get Dashboard
  try {
    const res = await fetch(`${baseUrl}/dashboard?user_id=${userId}`);
    const data = await res.json();
    if (res.ok) {
        console.log('✅ Dashboard fetched:', data);
        if (data.tasks.length > 0 && data.stats) {
            console.log('   Stats and Tasks present.');
        } else {
            console.error('   Missing stats or tasks in dashboard.');
        }
    } else {
        console.error('❌ Failed to fetch dashboard:', data);
    }
  } catch (e) { console.error(e); }

  // 5. Soft Delete Task
    try {
    const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleted_at: new Date().toISOString() })
    });
    const data = await res.json();
    if (res.ok && data.deleted_at) {
        console.log('✅ Task soft deleted:', data);
    } else {
        console.error('❌ Failed to soft delete task:', data);
    }
  } catch (e) { console.error(e); }

  // 6. Verify Soft Delete (Should not appear in Dashboard)
  try {
    const res = await fetch(`${baseUrl}/dashboard?user_id=${userId}`);
    const data = await res.json();
    if (res.ok) {
        const found = data.tasks.find(t => t.id === taskId);
        if (!found) {
            console.log('✅ Soft deleted task correctly hidden from dashboard.');
        } else {
            console.error('❌ Soft deleted task STILL VISIBLE in dashboard.');
        }
    }
  } catch (e) { console.error(e); }

}

runTests();
