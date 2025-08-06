import { useEffect, useState } from 'react';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data.data); // Accede a la propiedad 'data' de la respuesta //xdd
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { questions, loading, error };
} 