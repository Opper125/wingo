const supabase = Supabase.createClient(
    'https://qdusallinlchgvifxixd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdXNhbGxpbmxjaGd2aWZ4aXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDExNTcsImV4cCI6MjA1OTg3NzE1N30.Nnbjv3uJTfkwrrFE75PXU23yWATcfPRzQ748ULB8lGc'
);

async function fetchGameHistory(userId) {
    const { data, error } = await supabase.from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) console.error('Error fetching history:', error);
    return data || [];
}

function updateHistoryUI(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.created_at} - ${item.type === 'bet' ? 'Bet' : 'Win'} ${item.amount} MMK`;
        historyList.appendChild(li);
    });
}

supabase.channel('transactions').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, async payload => {
    const userId = localStorage.getItem('userId');
    if (payload.new.user_id === userId) {
        const history = await fetchGameHistory(userId);
        updateHistoryUI(history);
    }
}).subscribe();

window.supabase = supabase;
window.fetchGameHistory = fetchGameHistory;
window.updateHistoryUI = updateHistoryUI;
