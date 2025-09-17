

export async function fetchPostJSON(url: string, data: any) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        throw new Error(json.message || 'Something went wrong');
      }
  
      return json;
    } catch (error) {
      console.error('Error in fetchPostJSON:', error);
      throw error;
    }
  }
  