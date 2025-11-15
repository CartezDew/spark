/**
 * Schools Data Organized by Regions/Areas
 */

export const schoolRegions = {
  'Atlanta High School Partnerships': {
    name: 'Atlanta High School Partnerships',
    schools: [
      'BEST Academy High School',
      'Campbell High School',
      'Chapel Hill High School',
      'Charles Drew High School',
      'Charles R Drew Charter School',
      'Columbia High School',
      'DeKalb School of the Arts',
      'Douglas County High School',
      'Elite Scholars Academy',
      'Genesis Innovation Academy',
      'Georgia Cyber Academy',
      'Hillgrove High School',
      'Jonesboro High School',
      'Kennesaw Mountain High School',
      'KIPP Atlanta Collegiate',
      'Marietta High School',
      'Mundy\'s Mill High School',
      'North Atlanta High School',
      'North Cobb High School',
      'North Springs High School',
      'Phillips Exeter High School',
      'Riverwood International Charter School',
      'Rockdale County High School',
      'Salem High School',
      'St. Anne Pacelli Catholic School',
      'The Paideia School',
      'Westlake High School',
      'Woodward Academy'
    ]
  },
  'Metro Atlanta North': {
    name: 'Metro Atlanta North',
    schools: [
      'Alpharetta High School',
      'Centennial High School',
      'Chattahoochee High School',
      'Johns Creek High School',
      'Lambert High School',
      'Milton High School',
      'Northview High School',
      'Roswell High School'
    ]
  },
  'Metro Atlanta South': {
    name: 'Metro Atlanta South',
    schools: [
      'Clayton County High School',
      'Fayette County High School',
      'Henry County High School',
      'McIntosh High School',
      'Starr\'s Mill High School',
      'Whitewater High School'
    ]
  },
  'Metro Atlanta East': {
    name: 'Metro Atlanta East',
    schools: [
      'Brookwood High School',
      'Dacula High School',
      'Grayson High School',
      'Gwinnett County Schools',
      'Mill Creek High School',
      'Parkview High School',
      'Shiloh High School'
    ]
  },
  'Metro Atlanta West': {
    name: 'Metro Atlanta West',
    schools: [
      'Carrollton High School',
      'Douglas County High School',
      'East Paulding High School',
      'Hiram High School',
      'Paulding County High School',
      'South Paulding High School'
    ]
  },
  'Greater Georgia': {
    name: 'Greater Georgia',
    schools: [
      'Augusta Preparatory Day School',
      'Columbus High School',
      'Savannah Arts Academy',
      'The Westminster Schools',
      'Valdosta High School'
    ]
  }
};

/**
 * Get all region names
 */
export const getRegionNames = () => {
  return Object.keys(schoolRegions);
};

/**
 * Get schools for a specific region
 */
export const getSchoolsByRegion = (regionName) => {
  return schoolRegions[regionName]?.schools || [];
};

/**
 * Get region data
 */
export const getRegionData = (regionName) => {
  return schoolRegions[regionName] || null;
};

export default schoolRegions;

