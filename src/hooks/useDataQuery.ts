import { useQuery } from '@tanstack/react-query';
import { CouncilMember, ElectionDistrict, IndexTab } from '../types/data';

const fetchData = async <T>(fileName: string): Promise<T[]> => {
  // In a real environment, this might be a fetch call to an endpoint
  // Since we are looking at local JSON files, we can use dynamic import or fetch from public
  // But for Vite, we can just import them if they are in src.
  // However, the requirement says to create a useQuery API form that views this JSON.
  // which usually means fetching the json.
  const response = await fetch(`/data/${fileName}.json`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useIndexData = () => {
  return useQuery<IndexTab[]>({
    queryKey: ['index'],
    queryFn: () => fetchData<IndexTab>('index'),
  });
};

export const useElectionDistricts = (type: 'gyeonggi' | 'incheon') => {
  const fileName = type === 'gyeonggi' ? 'gyeonggi-districts' : 'incheon-districts';
  return useQuery<ElectionDistrict[]>({
    queryKey: ['districts', type],
    queryFn: () => fetchData<ElectionDistrict>(fileName),
  });
};

export const useCouncilMembers = (type: 'gyeonggi-si' | 'gyeonggi-do' | 'incheon-si' | 'incheon-gu') => {
  let fileName = '';
  switch (type) {
    case 'gyeonggi-do':
      fileName = 'gyeonggi-do-members';
      break;
    case 'gyeonggi-si':
      fileName = 'gyeonggi-si-members';
      break;
    case 'incheon-si':
      fileName = 'incheon-si-members';
      break;
    case 'incheon-gu':
      fileName = 'incheon-gu-members';
      break;
  }
  return useQuery<CouncilMember[]>({
    queryKey: ['members', type],
    queryFn: () => fetchData<CouncilMember>(fileName),
  });
};

export const useAllMembers = () => {
  return useQuery<({ category: string } & CouncilMember)[]>({
    queryKey: ['members', 'all'],
    queryFn: async () => {
      const types = [
        { id: 'gyeonggi-do', name: '경기도의원' },
        { id: 'gyeonggi-si', name: '경기도시군위원' },
        { id: 'incheon-si', name: '인천광역시의원' },
        { id: 'incheon-gu', name: '인천광역시구군위원' },
      ];
      
      const results = await Promise.all(
        types.map(async (type) => {
          const data = await fetchData<CouncilMember>(`${type.id}-members`);
          return data.map(member => ({ ...member, category: type.name, categoryId: type.id }));
        })
      );
      
      return results.flat() as any;
    },
  });
};
