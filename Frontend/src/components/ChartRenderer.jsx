import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#c9a227', '#8b7510', '#d4af37', '#b8860b', '#ffd700', '#daa520'];

export default function ChartRenderer({ grafica }) {
  if (!grafica || !grafica.datos) {
    return null;
  }

  // Mapear el nombre del mes en caso de que venga numérico
  const getNombreMes = (numMes) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[numMes - 1] || numMes;
  };

  // Preparar datos según el tipo de gráfica
  let chartData = [];
  let titulo = '';

  if (grafica.tipo === 'circular') {
    // Para gráfica circular, usar datos mensuales
    chartData = grafica.datos.map(item => ({
      name: getNombreMes(parseInt(item.mes || item.dia)),
      value: item.total || 0
    }));
    titulo = `Asistencias por mes - ${grafica.year}`;
  } else if (grafica.tipo === 'anual') {
    // Para gráfica anual, agrupar por mes
    chartData = grafica.datos.map(item => ({
      name: getNombreMes(parseInt(item.mes || item.dia)),
      total: item.total || 0
    }));
    titulo = `Asistencias anuales - ${grafica.year}`;
  } else {
    // Para gráfica mensual (por día)
    chartData = grafica.datos.map(item => ({
      name: new Date(item.dia).getDate(),
      total: item.total || 0
    }));
    titulo = `${grafica.nombreMes || 'Mes'} ${grafica.year}`;
  }

  return (
    <div className="chat-chart-container">
      <div className="chat-chart-titulo">{titulo}</div>
      
      {grafica.tipo === 'circular' ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #c9a227' }} />
            <Bar dataKey="total" fill="#c9a227" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
