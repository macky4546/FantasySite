import React, { useState, useEffect, useRef } from 'react';
// Assuming Tailwind CSS is configured and available globally for styling

// Player Data from the uploaded CSV file, with team data added from research.
const mockPlayersData = [
    { id: 1, name: 'JaMarr Chase', position: 'WR', team: 'CIN', adp: 2.05, tier: 'Tier 1' },
    { id: 2, name: 'Bijan Robinson', position: 'RB', team: 'ATL', adp: 2.79, tier: 'Tier 1' },
    { id: 3, name: 'Saquon Barkley', position: 'RB', team: 'PHI', adp: 3.08, tier: 'Tier 1' },
    { id: 4, name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', adp: 5.18, tier: 'Tier 1' },
    { id: 5, name: 'Justin Jefferson', position: 'WR', team: 'MIN', adp: 5.24, tier: 'Tier 1' },
    { id: 6, name: 'CeeDee Lamb', position: 'WR', team: 'DAL', adp: 5.3, tier: 'Tier 1' },
    { id: 7, name: 'Derrick Henry', position: 'RB', team: 'BAL', adp: 8.21, tier: 'Tier 2' },
    { id: 8, name: 'Nico Collins', position: 'WR', team: 'HOU', adp: 9.2, tier: 'Tier 2' },
    { id: 9, name: 'Brian Thomas Jr.', position: 'WR', team: 'JAX', adp: 11.07, tier: 'Tier 2' },
    { id: 10, name: 'Malik Nabers', position: 'WR', team: 'NYG', adp: 11.17, tier: 'Tier 2' },
    { id: 11, name: 'Puka Nacua', position: 'WR', team: 'LAR', adp: 11.42, tier: 'Tier 2' },
    { id: 12, name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', adp: 13.17, tier: 'Tier 2' },
    { id: 13, name: 'Christian McCaffrey', position: 'RB', team: 'SF', adp: 13.72, tier: 'Tier 2' },
    { id: 14, name: 'Ashton Jeanty', position: 'RB', team: 'LV', adp: 13.89, tier: 'Tier 2' },
    { id: 15, name: 'Jonathan Taylor', position: 'RB', team: 'IND', adp: 16.47, tier: 'Tier 3' },
    { id: 16, name: 'A.J. Brown', position: 'WR', team: 'PHI', adp: 16.79, tier: 'Tier 3' },
    { id: 17, name: 'Drake London', position: 'WR', team: 'ATL', adp: 17.23, tier: 'Tier 3' },
    { id: 18, name: 'DeVon Achane', position: 'RB', team: 'MIA', adp: 17.55, tier: 'Tier 3' },
    { id: 19, name: 'Josh Jacobs', position: 'RB', team: 'GB', adp: 19.16, tier: 'Tier 3' },
    { id: 20, name: 'Brock Bowers', position: 'TE', team: 'LV', adp: 21.57, tier: 'Tier 3' },
    { id: 21, name: 'George Kittle', position: 'TE', team: 'SF', adp: 21.8, tier: 'Tier 3' },
    { id: 22, name: 'Ladd McConkey', position: 'WR', team: 'LAC', adp: 23.18, tier: 'Tier 4' },
    { id: 23, name: 'Bucky Irving', position: 'RB', team: 'TB', adp: 24.18, tier: 'Tier 4' },
    { id: 24, name: 'Kyren Williams', position: 'RB', team: 'LAR', adp: 24.83, tier: 'Tier 4' },
    { id: 25, name: 'Josh Allen', position: 'QB', team: 'BUF', adp: 26.08, tier: 'Tier 4' },
    { id: 26, name: 'Lamar Jackson', position: 'QB', team: 'BAL', adp: 26.7, tier: 'Tier 4' },
    { id: 27, name: 'Mike Evans', position: 'WR', team: 'TB', adp: 28.07, tier: 'Tier 4' },
    { id: 28, name: 'Tee Higgins', position: 'WR', team: 'CIN', adp: 28.34, tier: 'Tier 4' },
    { id: 29, name: 'Chase Brown', position: 'RB', team: 'CIN', adp: 28.53, tier: 'Tier 4' },
    { id: 30, name: 'Tyreek Hill', position: 'WR', team: 'MIA', adp: 32.48, tier: 'Tier 5' },
    { id: 31, name: 'Trey McBride', position: 'TE', team: 'ARI', adp: 32.85, tier: 'Tier 5' },
    { id: 32, name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', adp: 33.59, tier: 'Tier 5' },
    { id: 33, name: 'Jayden Daniels', position: 'QB', team: 'WAS', adp: 33.78, tier: 'Tier 5' },
    { id: 34, name: 'James Cook', position: 'RB', team: 'BUF', adp: 34.37, tier: 'Tier 5' },
    { id: 35, name: 'Davante Adams', position: 'WR', team: 'NYJ', adp: 35.72, tier: 'Tier 5' },
    { id: 36, name: 'Jalen Hurts', position: 'QB', team: 'PHI', adp: 36.63, tier: 'Tier 5' },
    { id: 37, name: 'Garrett Wilson', position: 'WR', team: 'NYJ', adp: 39.3, tier: 'Tier 6' },
    { id: 38, name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', adp: 40.11, tier: 'Tier 6' },
    { id: 39, name: 'Omarion Hampton', position: 'RB', team: 'LAC', adp: 40.42, tier: 'Tier 6' },
    { id: 40, name: 'Kenneth Walker III', position: 'RB', team: 'SEA', adp: 40.47, tier: 'Tier 6' },
    { id: 41, name: 'Breece Hall', position: 'RB', team: 'NYJ', adp: 42.11, tier: 'Tier 6' },
    { id: 42, name: 'Terry McLaurin', position: 'WR', team: 'WAS', adp: 42.15, tier: 'Tier 6' },
    { id: 43, name: 'DK Metcalf', position: 'WR', team: 'SEA', adp: 45.72, tier: 'Tier 7' },
    { id: 44, name: 'Chuba Hubbard', position: 'RB', team: 'CAR', adp: 46.97, tier: 'Tier 7' },
    { id: 45, name: 'Joe Burrow', position: 'QB', team: 'CIN', adp: 47.47, tier: 'Tier 7' },
    { id: 46, name: 'James Conner', position: 'RB', team: 'ARI', adp: 47.98, tier: 'Tier 7' },
    { id: 47, name: 'Jameson Williams', position: 'WR', team: 'DET', adp: 48.22, tier: 'Tier 7' },
    { id: 48, name: 'Alvin Kamara', position: 'RB', team: 'NO', adp: 48.7, tier: 'Tier 7' },
    { id: 49, name: 'DJ Moore', position: 'WR', team: 'CHI', adp: 48.99, tier: 'Tier 7' },
    { id: 50, name: 'Courtland Sutton', position: 'WR', team: 'DEN', adp: 50.1, tier: 'Tier 7' },
    { id: 51, name: 'TreVeyon Henderson', position: 'RB', team: 'NE', adp: 54.08, tier: 'Tier 8' },
    { id: 52, name: 'Xavier Worthy', position: 'WR', team: 'KC', adp: 54.46, tier: 'Tier 8' },
    { id: 53, name: 'Zay Flowers', position: 'WR', team: 'BAL', adp: 56.08, tier: 'Tier 8' },
    { id: 54, name: 'David Montgomery', position: 'RB', team: 'DET', adp: 57.34, tier: 'Tier 9' },
    { id: 55, name: 'DeVonta Smith', position: 'WR', team: 'PHI', adp: 57.64, tier: 'Tier 9' },
    { id: 56, name: 'George Pickens', position: 'WR', team: 'PIT', adp: 58.13, tier: 'Tier 9' },
    { id: 57, name: 'Calvin Ridley', position: 'WR', team: 'TEN', adp: 58.46, tier: 'Tier 9' },
    { id: 58, name: 'Tetairoa McMillan', position: 'WR', team: 'CAR', adp: 60.49, tier: 'Tier 9' },
    { id: 59, name: 'DAndre Swift', position: 'RB', team: 'CHI', adp: 60.49, tier: 'Tier 9' },
    { id: 60, name: 'Sam LaPorta', position: 'TE', team: 'DET', adp: 60.77, tier: 'Tier 9' },
    { id: 61, name: 'Tony Pollard', position: 'RB', team: 'TEN', adp: 63.36, tier: 'Tier 10' },
    { id: 62, name: 'Isiah Pacheco', position: 'RB', team: 'KC', adp: 64.33, tier: 'Tier 10' },
    { id: 63, name: 'Patrick Mahomes II', position: 'QB', team: 'KC', adp: 64.73, tier: 'Tier 10' },
    { id: 64, name: 'Jaylen Waddle', position: 'WR', team: 'MIA', adp: 66.58, tier: 'Tier 10' },
    { id: 65, name: 'RJ Harvey', position: 'RB', team: 'DEN', adp: 66.68, tier: 'Tier 10' },
    { id: 66, name: 'Mark Andrews', position: 'TE', team: 'BAL', adp: 67.7, tier: 'Tier 10' },
    { id: 67, name: 'Aaron Jones Sr.', position: 'RB', team: 'MIN', adp: 69.08, tier: 'Tier 10' },
    { id: 68, name: 'Rashee Rice', position: 'WR', team: 'KC', adp: 70.91, tier: 'Tier 11' },
    { id: 69, name: 'Baker Mayfield', position: 'QB', team: 'TB', adp: 71.35, tier: 'Tier 11' },
    { id: 70, name: 'Kaleb Johnson', position: 'RB', team: 'PIT', adp: 72.33, tier: 'Tier 11' },
    { id: 71, name: 'Brian Robinson Jr.', position: 'RB', team: 'WAS', adp: 72.51, tier: 'Tier 11' },
    { id: 72, name: 'Travis Hunter', position: 'WR', team: 'JAX', adp: 74.74, tier: 'Tier 11' },
    { id: 73, name: 'Bo Nix', position: 'QB', team: 'DEN', adp: 76.14, tier: 'Tier 11' },
    { id: 74, name: 'T.J. Hockenson', position: 'TE', team: 'MIN', adp: 76.99, tier: 'Tier 11' },
    { id: 75, name: 'Tyrone Tracy Jr.', position: 'RB', team: 'NYG', adp: 79.3, tier: 'Tier 12' },
    { id: 76, name: 'Kyler Murray', position: 'QB', team: 'ARI', adp: 80.66, tier: 'Tier 12' },
    { id: 77, name: 'Joe Mixon', position: 'RB', team: 'HOU', adp: 81.4, tier: 'Tier 12' },
    { id: 78, name: 'Rome Odunze', position: 'WR', team: 'CHI', adp: 81.98, tier: 'Tier 12' },
    { id: 79, name: 'Chris Olave', position: 'WR', team: 'NO', adp: 83.11, tier: 'Tier 12' },
    { id: 80, name: 'Jerry Jeudy', position: 'WR', team: 'CLE', adp: 84.97, tier: 'Tier 12' },
    { id: 81, name: 'Ricky Pearsall', position: 'WR', team: 'SF', adp: 85.91, tier: 'Tier 12' },
    { id: 82, name: 'Jordan Addison', position: 'WR', team: 'MIN', adp: 87.24, tier: 'Tier 12' },
    { id: 83, name: 'Dak Prescott', position: 'QB', team: 'DAL', adp: 87.63, tier: 'Tier 12' },
    { id: 84, name: 'Jordan Mason', position: 'RB', team: 'SF', adp: 89.72, tier: 'Tier 13' },
    { id: 85, name: 'Travis Kelce', position: 'TE', team: 'KC', adp: 89.96, tier: 'Tier 13' },
    { id: 86, name: 'Deebo Samuel Sr.', position: 'WR', team: 'SF', adp: 91.77, tier: 'Tier 13' },
    { id: 87, name: 'Brock Purdy', position: 'QB', team: 'SF', adp: 92.18, tier: 'Tier 13' },
    { id: 88, name: 'Tucker Kraft', position: 'TE', team: 'GB', adp: 92.98, tier: 'Tier 13' },
    { id: 89, name: 'Jaylen Warren', position: 'RB', team: 'PIT', adp: 93.46, tier: 'Tier 13' },
    { id: 90, name: 'Jayden Reed', position: 'WR', team: 'GB', adp: 94.07, tier: 'Tier 13' },
    { id: 91, name: 'Jauan Jennings', position: 'WR', team: 'SF', adp: 94.78, tier: 'Tier 13' },
    { id: 92, name: 'Justin Fields', position: 'QB', team: 'PIT', adp: 94.92, tier: 'Tier 13' },
    { id: 93, name: 'David Njoku', position: 'TE', team: 'CLE', adp: 94.96, tier: 'Tier 13' },
    { id: 94, name: 'Travis Etienne Jr.', position: 'RB', team: 'JAX', adp: 95.79, tier: 'Tier 13' },
    { id: 95, name: 'Justin Herbert', position: 'QB', team: 'LAC', adp: 98.27, tier: 'Tier 13' },
    { id: 96, name: 'Jakobi Meyers', position: 'WR', team: 'LV', adp: 99.54, tier: 'Tier 14' },
    { id: 97, name: 'Jared Goff', position: 'QB', team: 'DET', adp: 102.24, tier: 'Tier 14' },
    { id: 98, name: 'Caleb Williams', position: 'QB', team: 'CHI', adp: 102.27, tier: 'Tier 14' },
    { id: 99, name: 'Stefon Diggs', position: 'WR', team: 'HOU', adp: 102.87, tier: 'Tier 14' },
    { id: 100, name: 'Tank Bigsby', position: 'RB', team: 'JAX', adp: 103, tier: 'Tier 14' },
    { id: 101, name: 'Rhamondre Stevenson', position: 'RB', team: 'NE', adp: 103.88, tier: 'Tier 14' },
    { id: 102, name: 'Drake Maye', position: 'QB', team: 'NE', adp: 104.55, tier: 'Tier 14' },
    { id: 103, name: 'J.K. Dobbins', position: 'RB', team: 'DEN', adp: 105.11, tier: 'Tier 14' },
    { id: 104, name: 'Zach Charbonnet', position: 'RB', team: 'SEA', adp: 105.61, tier: 'Tier 14' },
    { id: 105, name: 'Emeka Egbuka', position: 'WR', team: 'TB', adp: 105.7, tier: 'Tier 14' },
    { id: 106, name: 'Tyler Warren', position: 'TE', team: 'IND', adp: 105.92, tier: 'Tier 14' },
    { id: 107, name: 'Evan Engram', position: 'TE', team: 'DEN', adp: 106.25, tier: 'Tier 14' },
    { id: 108, name: 'Javonte Williams', position: 'RB', team: 'DAL', adp: 106.34, tier: 'Tier 14' },
    { id: 109, name: 'Chris Godwin', position: 'WR', team: 'TB', adp: 108.35, tier: 'Tier 14' },
    { id: 110, name: 'Jordan Love', position: 'QB', team: 'GB', adp: 110.21, tier: 'Tier 15' },
    { id: 111, name: 'Khalil Shakir', position: 'WR', team: 'BUF', adp: 111.12, tier: 'Tier 15' },
    { id: 112, name: 'Najee Harris', position: 'RB', team: 'PIT', adp: 116.35, tier: 'Tier 15' },
    { id: 113, name: 'Trevor Lawrence', position: 'QB', team: 'JAX', adp: 116.76, tier: 'Tier 15' },
    { id: 114, name: 'Josh Downs', position: 'WR', team: 'IND', adp: 117.11, tier: 'Tier 15' },
    { id: 115, name: 'Matthew Golden', position: 'WR', team: 'GB', adp: 104.42, tier: 'Tier 14' },
    { id: 116, name: 'Cam Skattebo', position: 'RB', team: 'N/A', adp: 118.47, tier: 'Tier 15' },
    { id: 117, name: 'C.J. Stroud', position: 'QB', team: 'HOU', adp: 118.98, tier: 'Tier 15' },
    { id: 118, name: 'Dalton Kincaid', position: 'TE', team: 'BUF', adp: 119.62, tier: 'Tier 15' },
    { id: 119, name: 'Quinshon Judkins', position: 'RB', team: 'N/A', adp: 119.77, tier: 'Tier 15' },
    { id: 120, name: 'Dallas Goedert', position: 'TE', team: 'PHI', adp: 121.68, tier: 'Tier 15' },
    { id: 121, name: 'Cooper Kupp', position: 'WR', team: 'SEA', adp: 122.16, tier: 'Tier 15' },
    { id: 122, name: 'Darnell Mooney', position: 'WR', team: 'ATL', adp: 123.98, tier: 'Tier 16' },
    { id: 123, name: 'Michael Pittman Jr.', position: 'WR', team: 'IND', adp: 124.43, tier: 'Tier 16' },
    { id: 124, name: 'Keon Coleman', position: 'WR', team: 'BUF', adp: 125.25, tier: 'Tier 16' },
    { id: 125, name: 'Ray Davis', position: 'RB', team: 'BUF', adp: 126.99, tier: 'Tier 16' },
    { id: 126, name: 'Tyjae Spears', position: 'RB', team: 'TEN', adp: 127.51, tier: 'Tier 16' },
    { id: 127, name: 'Kyle Pitts Sr.', position: 'TE', team: 'ATL', adp: 127.97, tier: 'Tier 16' },
    { id: 128, name: 'J.J. McCarthy', position: 'QB', team: 'MIN', adp: 128.04, tier: 'Tier 16' },
    { id: 129, name: 'Brandon Aiyuk', position: 'WR', team: 'SF', adp: 129.92, tier: 'Tier 16' },
    { id: 130, name: 'Rachaad White', position: 'RB', team: 'TB', adp: 131.68, tier: 'Tier 17' },
    { id: 131, name: 'Trey Benson', position: 'RB', team: 'ARI', adp: 132.3, tier: 'Tier 17' },
    { id: 132, name: 'Rashid Shaheed', position: 'WR', team: 'NO', adp: 132.37, tier: 'Tier 17' },
    { id: 133, name: 'Colston Loveland', position: 'TE', team: 'CHI', adp: 133.92, tier: 'Tier 17' },
    { id: 134, name: 'Tyler Allgeier', position: 'RB', team: 'ATL', adp: 137.23, tier: 'Tier 17' },
    { id: 135, name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', adp: 138.33, tier: 'Tier 18' },
    { id: 136, name: 'Jake Ferguson', position: 'TE', team: 'DAL', adp: 139.25, tier: 'Tier 18' },
    { id: 137, name: 'Braelon Allen', position: 'RB', team: 'NYJ', adp: 139.3, tier: 'Tier 18' },
    { id: 138, name: 'Rashod Bateman', position: 'WR', team: 'BAL', adp: 140.98, tier: 'Tier 18' },
    { id: 139, name: 'Isaac Guerendo', position: 'RB', team: 'SF', adp: 141.41, tier: 'Tier 18' },
    { id: 140, name: 'Jaydon Blue', position: 'RB', team: 'DAL', adp: 143.44, tier: 'Tier 18' },
    { id: 141, name: 'Bryce Young', position: 'QB', team: 'CAR', adp: 145.35, tier: 'Tier 19' },
    { id: 142, name: 'Christian Kirk', position: 'WR', team: 'JAX', adp: 145.55, tier: 'Tier 19' },
    { id: 143, name: 'Nick Chubb', position: 'RB', team: 'CLE', adp: 145.68, tier: 'Tier 19' },
    { id: 144, name: 'Austin Ekeler', position: 'RB', team: 'WAS', adp: 145.93, tier: 'Tier 19' },
    { id: 145, name: 'Jerome Ford', position: 'RB', team: 'CLE', adp: 148.78, tier: 'Tier 19' },
    { id: 146, name: 'Marvin Mims Jr.', position: 'WR', team: 'DEN', adp: 150.12, tier: 'Tier 19' },
    { id: 147, name: 'Michael Penix Jr.', position: 'QB', team: 'ATL', adp: 151.43, tier: 'Tier 19' },
    { id: 148, name: 'Rico Dowdle', position: 'RB', team: 'DAL', adp: 151.71, tier: 'Tier 19' },
    { id: 149, name: 'Luther Burden III', position: 'WR', team: 'CHI', adp: 151.91, tier: 'Tier 19' },
    { id: 150, name: 'Hunter Henry', position: 'TE', team: 'NE', adp: 151.99, tier: 'Tier 19' },
    { id: 151, name: 'Jonnu Smith', position: 'TE', team: 'MIA', adp: 154.16, tier: 'Tier 19' },
    { id: 152, name: 'Jaylen Wright', position: 'RB', team: 'MIA', adp: 156.5, tier: 'Tier 20' },
    { id: 153, name: 'Cedric Tillman', position: 'WR', team: 'CLE', adp: 157.62, tier: 'Tier 20' },
    { id: 154, name: 'Matthew Stafford', position: 'QB', team: 'LAR', adp: 161.93, tier: 'Tier 20' },
    { id: 155, name: 'Isaiah Likely', position: 'TE', team: 'BAL', adp: 163.24, tier: 'Tier 20' },
    { id: 156, name: 'Bhayshul Tuten', position: 'RB', team: 'N/A', adp: 155.38, tier: 'Tier 19' },
    { id: 157, name: 'Romeo Doubs', position: 'WR', team: 'GB', adp: 164.12, tier: 'Tier 20' },
    { id: 158, name: 'Denver Broncos', position: 'DST', team: 'DEN', adp: 152.2, tier: 'Tier 19' },
    { id: 159, name: 'Jayden Higgins', position: 'WR', team: 'HOU', adp: 153.25, tier: 'Tier 19' },
    { id: 160, name: 'Dylan Sampson', position: 'RB', team: 'CLE', adp: 157.88, tier: 'Tier 20' },
    { id: 161, name: 'Zach Ertz', position: 'TE', team: 'WAS', adp: 168.34, tier: 'Tier 21' },
    { id: 162, name: 'Marquise Brown', position: 'WR', team: 'KC', adp: 169.16, tier: 'Tier 21' },
    { id: 163, name: 'Geno Smith', position: 'QB', team: 'SEA', adp: 170.82, tier: 'Tier 21' },
    { id: 164, name: 'Jalen McMillan', position: 'WR', team: 'TB', adp: 170.62, tier: 'Tier 21' },
    { id: 165, name: 'Roschon Johnson', position: 'RB', team: 'CHI', adp: 173.51, tier: 'Tier 21' },
    { id: 166, name: 'Tre Harris', position: 'WR', team: 'LAC', adp: 171.8, tier: 'Tier 21' },
    { id: 167, name: 'Quentin Johnston', position: 'WR', team: 'LAC', adp: 174.9, tier: 'Tier 21' },
    { id: 168, name: 'Kyle Williams', position: 'WR', team: 'NE', adp: 177.23, tier: 'Tier 21' },
    { id: 169, name: 'Philadelphia Eagles', position: 'DST', team: 'PHI', adp: 162.99, tier: 'Tier 20' },
    { id: 170, name: 'Joshua Palmer', position: 'WR', team: 'LAC', adp: 177.92, tier: 'Tier 21' },
    { id: 171, name: 'Blake Corum', position: 'RB', team: 'LAR', adp: 181.59, tier: 'Tier 22' },
    { id: 172, name: 'Baltimore Ravens', position: 'DST', team: 'BAL', adp: 170.41, tier: 'Tier 21' },
    { id: 173, name: 'Pittsburgh Steelers', position: 'DST', team: 'PIT', adp: 167.95, tier: 'Tier 21' },
    { id: 174, name: 'Adam Thielen', position: 'WR', team: 'CAR', adp: 185.17, tier: 'Tier 22' },
    { id: 175, name: 'Keenan Allen', position: 'WR', team: 'CHI', adp: 173.76, tier: 'Tier 21' },
    { id: 176, name: 'Minnesota Vikings', position: 'DST', team: 'MIN', adp: 174.41, tier: 'Tier 21' },
    { id: 177, name: 'MarShawn Lloyd', position: 'RB', team: 'GB', adp: 187.93, tier: 'Tier 22' },
    { id: 178, name: 'DeAndre Hopkins', position: 'WR', team: 'BAL', adp: 191.58, tier: 'Tier 23' },
    { id: 179, name: 'DeMario Douglas', position: 'WR', team: 'NE', adp: 192.15, tier: 'Tier 23' },
    { id: 180, name: 'Sam Darnold', position: 'QB', team: 'MIN', adp: 192.48, tier: 'Tier 23' },
    { id: 181, name: 'Xavier Legette', position: 'WR', team: 'CAR', adp: 190.43, tier: 'Tier 23' },
    { id: 182, name: 'Cam Ward', position: 'QB', team: 'TEN', adp: 193.51, tier: 'Tier 23' },
    { id: 183, name: 'WanDale Robinson', position: 'WR', team: 'NYG', adp: 196.21, tier: 'Tier 23' },
    { id: 184, name: 'Alec Pierce', position: 'WR', team: 'IND', adp: 191.78, tier: 'Tier 23' },
    { id: 185, name: 'Houston Texans', position: 'DST', team: 'HOU', adp: 183.62, tier: 'Tier 22' },
    { id: 186, name: 'Buffalo Bills', position: 'DST', team: 'BUF', adp: 185.56, tier: 'Tier 22' },
    { id: 187, name: 'Brandon Aubrey', position: 'K', team: 'DAL', adp: 186.02, tier: 'Tier 22' },
    { id: 188, name: 'Kansas City Chiefs', position: 'DST', team: 'KC', adp: 186.64, tier: 'Tier 22' },
    { id: 189, name: 'Detroit Lions', position: 'DST', team: 'DET', adp: 187.97, tier: 'Tier 22' },
    { id: 190, name: 'Brenton Strange', position: 'TE', team: 'JAX', adp: 190.02, tier: 'Tier 23' },
    { id: 191, name: 'Jake Bates', position: 'K', team: 'DET', adp: 192.75, tier: 'Tier 23' },
    { id: 192, name: 'Cameron Dicker', position: 'K', team: 'LAC', adp: 192.94, tier: 'Tier 23' },
    { id: 193, name: 'Seattle Seahawks', position: 'DST', team: 'SEA', adp: 199.34, tier: 'Tier 24' },
    { id: 194, name: 'Wil Lutz', position: 'K', team: 'DEN', adp: 201.73, tier: 'Tier 24' },
    { id: 195, name: 'Kendre Miller', position: 'RB', team: 'NO', adp: 204.16, tier: 'Tier 24' },
    { id: 196, name: 'Los Angeles Rams', position: 'DST', team: 'LAR', adp: 202.66, tier: 'Tier 24' },
    { id: 197, name: 'Los Angeles Chargers', position: 'DST', team: 'LAC', adp: 195.94, tier: 'Tier 24' },
    { id: 198, name: 'Mike Gesicki', position: 'TE', team: 'CIN', adp: 211.47, tier: 'Tier 24' },
    { id: 199, name: 'Pat Freiermuth', position: 'TE', team: 'PIT', adp: 210.56, tier: 'Tier 24' },
    { id: 200, name: 'Chase McLaughlin', position: 'K', team: 'TB', adp: 207.44, tier: 'Tier 24' },
];

const initialTeams = [
  {
    id: 1, name: 'Jeremy', owner: 'Jeremy', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 },
      RB: { current: 0, max: 2 },
      WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 },
      FLEX: { current: 0, max: 1 }, // RB/WR/TE
      DP: { current: 0, max: 1 }, // Assuming a generic defensive player slot
      'D/ST': { current: 0, max: 1 },
      K: { current: 0, max: 1 },
      Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 } // Not actively managed for now
    }
  },
  {
    id: 2, name: 'CDUB', owner: 'CDUB', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 3, name: 'Angel', owner: 'Angel', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 4, name: 'G', owner: 'G', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 5, name: 'ROB', owner: 'ROB', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 6, name: 'Rios', owner: 'Rios', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 7, name: 'Howard', owner: 'Howard', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 8, name: 'Yata', owner: 'Yata', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 9, name: 'Jesse', owner: 'Jesse', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 10, name: 'Ciurleo', owner: 'Ciurleo', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 11, name: 'Josh', owner: 'Josh', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
  {
    id: 12, name: 'Dion', owner: 'Dion', roster: [],
    rosterSlots: {
      QB: { current: 0, max: 1 }, RB: { current: 0, max: 2 }, WR: { current: 0, max: 2 },
      TE: { current: 0, max: 1 }, FLEX: { current: 0, max: 1 }, DP: { current: 0, max: 1 },
      'D/ST': { current: 0, max: 1 }, K: { current: 0, max: 1 }, Bench: { current: 0, max: 5 },
      IR: { current: 0, max: 1 }
    }
  },
];

const App = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(initialTeams);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [draftStarted, setDraftStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToDraft, setPlayerToDraft] = useState(null);
  const [teamToDraftTo, setTeamToDraftTo] = useState(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false); // Data is static
  const [draftHistory, setDraftHistory] = useState([]);
  const [expandedTiers, setExpandedTiers] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    draftStatus: true,
    draftedPlayers: true,
    teamRosters: true,
  });
  const [message, setMessage] = useState('');
  const messageTimeoutRef = useRef(null);
  const playerListRef = useRef(null);

  useEffect(() => {
    setPlayers(mockPlayersData);
  }, []);

  useEffect(() => {
    const generateDraftOrder = () => {
      const order = [];
      const numTeams = teams.length;
      const numRounds = 15;

      for (let round = 0; round < numRounds; round++) {
        if (round % 2 === 0) {
          for (let i = 0; i < numTeams; i++) {
            order.push(teams[i].id);
          }
        } else {
          for (let i = numTeams - 1; i >= 0; i--) {
            order.push(teams[i].id);
          }
        }
      }
      setDraftOrder(order);
    };

    if (!isLoadingPlayers) {
      generateDraftOrder();
    }
  }, [teams, isLoadingPlayers]);

  const currentTeamId = draftOrder[currentPickIndex];
  const currentTeam = teams.find(team => team.id === currentTeamId);

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const availablePlayers = players.filter(player =>
    !player.isDrafted &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playersByTier = availablePlayers.reduce((acc, player) => {
    const tierName = player.tier || 'Uncategorized';
    if (!acc[tierName]) {
      acc[tierName] = [];
    }
    acc[tierName].push(player);
    return acc;
  }, {});

  const sortedTiers = Object.keys(playersByTier).sort((a, b) => {
    const tierNumA = parseInt(a.match(/Tier (\d+)/)?.[1]) || Infinity;
    const tierNumB = parseInt(b.match(/Tier (\d+)/)?.[1]) || Infinity;
    if (tierNumA !== tierNumB) {
      return tierNumA - tierNumB;
    }
    return a.localeCompare(b);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (playerListRef.current) {
      playerListRef.current.scrollTop = 0;
    }
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    setPlayers(prevPlayers => [...prevPlayers].sort((a, b) => a.adp - b.adp));
    const initialExpandedTiersState = sortedTiers.reduce((acc, tier) => {
        acc[tier] = true;
        return acc;
    }, {});
    setExpandedTiers(initialExpandedTiersState);
  };

  const handleDraftPlayer = (player, team) => {
    if (!team) {
      showTemporaryMessage('No team is currently on the clock.');
      return;
    }

    const currentRoster = team.rosterSlots;
    let slotFound = false;
    let draftedSlotType = '';

    if (currentRoster[player.position] && currentRoster[player.position].current < currentRoster[player.position].max) {
      slotFound = true;
      draftedSlotType = player.position;
    }
    else if (['RB', 'WR', 'TE'].includes(player.position) && currentRoster.FLEX.current < currentRoster.FLEX.max) {
      slotFound = true;
      draftedSlotType = 'FLEX';
    }
    else if (currentRoster.Bench.current < currentRoster.Bench.max) {
      slotFound = true;
      draftedSlotType = 'Bench';
    }

    if (slotFound) {
      setPlayerToDraft({ ...player, draftedSlotType });
      setTeamToDraftTo(team);
      setShowConfirmation(true);
    } else {
      showTemporaryMessage(`${team.name} has no available ${player.position}, FLEX, or Bench slots for ${player.name}.`);
    }
  };

  const confirmDraft = () => {
    if (!playerToDraft || !teamToDraftTo) return;

    const draftedPlayerWithPick = {
      ...playerToDraft,
      isDrafted: true,
      draftedBy: teamToDraftTo.id,
      draftedPickNumber: currentPickIndex + 1
    };

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === draftedPlayerWithPick.id ? draftedPlayerWithPick : p
      )
    );

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === teamToDraftTo.id) {
          const updatedRosterSlots = { ...t.rosterSlots };
          if (updatedRosterSlots[draftedPlayerWithPick.draftedSlotType]) {
            updatedRosterSlots[draftedPlayerWithPick.draftedSlotType].current++;
          }
          return { ...t, roster: [...t.roster, draftedPlayerWithPick], rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    setDraftHistory(prevHistory => [...prevHistory, { player: draftedPlayerWithPick, team: teamToDraftTo }]);
    setCurrentPickIndex(prevIndex => prevIndex + 1);
    setSearchTerm('');
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const handleUndoLastPick = () => {
    if (draftHistory.length === 0) return;

    const lastPick = draftHistory[draftHistory.length - 1];
    const { player: lastDraftedPlayer, team: draftingTeam } = lastPick;

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === lastDraftedPlayer.id ? { ...p, isDrafted: false, draftedBy: undefined, draftedPickNumber: undefined, draftedSlotType: undefined } : p
      )
    );

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === draftingTeam.id) {
          const updatedRosterSlots = { ...t.rosterSlots };
          if (updatedRosterSlots[lastDraftedPlayer.draftedSlotType]) {
            updatedRosterSlots[lastDraftedPlayer.draftedSlotType].current--;
          }
          return { ...t, roster: t.roster.filter(p => p.id !== lastDraftedPlayer.id), rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    setCurrentPickIndex(prevIndex => Math.max(0, prevIndex - 1));
    setDraftHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 1));
  };


  const cancelDraftConfirmation = () => {
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const toggleTier = (tierName) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tierName]: !prev[tierName]
    }));
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const DraftConfirmationModal = ({ player, team, onConfirm, onCancel }) => {
    if (!player || !team) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Draft Pick</h3>
          <p className="text-gray-700 mb-6">
            Are you sure you want to draft <span className="font-semibold text-blue-600">{player.name}</span>
            <span className="text-gray-500"> ({player.position} - {player.team})</span> to <span className="font-semibold text-green-600">{team.name}</span>?
            <br />
            <span className="text-sm text-gray-500">This player will be placed in the **{player.draftedSlotType}** slot.</span>
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Draft Player
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-900 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 mt-4 sm:mt-8 text-center drop-shadow-md">
        GangGreen Draft
      </h1>

      {!draftStarted ? (
        <div className="bg-white p-8 rounded-lg shadow-xl w-full text-center">
          <p className="text-gray-700 text-lg mb-6">
            Welcome to your live fantasy football draft! Click "Start Draft" to begin.
          </p>
          <button
            onClick={handleStartDraft}
            disabled={isLoadingPlayers} // Disable button while loading
            className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 ease-in-out
              ${isLoadingPlayers
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400'
              }`}
          >
            {isLoadingPlayers ? 'Loading Players...' : 'Start Draft'}
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Available Players */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Available Players</h2>
            <input
              type="text"
              placeholder="Search players..."
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-200 ease-in-out"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isLoadingPlayers}
            />
            <div className="overflow-y-auto flex-grow pr-2 -mr-2" style={{ maxHeight: '70vh' }} ref={playerListRef}>
              {isLoadingPlayers ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading players data...</p>
                </div>
              ) : availablePlayers.length > 0 ? (
                <div>
                  {sortedTiers.map(tierName => (
                    <div key={tierName} className="mb-4 last:mb-0">
                      <button
                        className="w-full text-left py-2 px-3 bg-blue-100 rounded-lg flex justify-between items-center text-blue-800 font-semibold hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                        onClick={() => toggleTier(tierName)}
                      >
                        {tierName} ({playersByTier[tierName].length} players)
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${expandedTiers[tierName] ? 'rotate-90' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      {expandedTiers[tierName] && (
                        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-b-lg mt-1">
                          {playersByTier[tierName].map(player => (
                            <li key={player.id} className="py-3 px-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div className="flex-grow mb-2 sm:mb-0">
                                <span className="font-semibold text-lg text-gray-800">{player.name}</span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({player.position} - {player.team}) ADP: {player.adp}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDraftPlayer(player, currentTeam)}
                                disabled={!currentTeam}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out
                                  ${currentTeam
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  }`}
                              >
                                Draft
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No available players match your search.</p>
              )}
            </div>
          </div>

          {/* Middle Panel: Draft Board & Current Pick */}
          <div className="lg:col-span-2 flex flex-col space-y-8">
            {/* Draft Status Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
                onClick={() => toggleSection('draftStatus')}
              >
                Draft Status
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedSections.draftStatus ? 'rotate-90' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {expandedSections.draftStatus && (
                <div className="transition-all duration-300 ease-in-out overflow-hidden">
                  {currentPickIndex < draftOrder.length ? (
                    <div className="text-center">
                      <p className="text-xl text-gray-600 mb-2">
                        Current Pick: <span className="font-bold text-blue-600">#{currentPickIndex + 1}</span>
                      </p>
                      <p className="text-2xl font-semibold text-green-700">
                        {currentTeam ? `${currentTeam.name} is on the clock!` : 'Loading...'}
                      </p>
                      <button
                        onClick={handleUndoLastPick}
                        disabled={draftHistory.length === 0}
                        className={`mt-4 px-6 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out
                          ${draftHistory.length > 0
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        Undo Last Pick
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-2xl font-bold text-green-700">Draft Complete!</p>
                  )}
                  {message && (
                    <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                      {message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Insights Section */}
            {/* This section has been removed to simplify the app for now. */}

            {/* Drafted Players / Draft Board Overview */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-grow">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
                onClick={() => toggleSection('draftedPlayers')}
              >
                Drafted Players
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedSections.draftedPlayers ? 'rotate-90' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {expandedSections.draftedPlayers && (
                <div className="transition-all duration-300 ease-in-out overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                            Pick
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Player
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slot
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                            Drafted By
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {players.filter(player => player.isDrafted).length > 0 ? (
                          players
                            .filter(player => player.isDrafted)
                            .sort((a, b) => a.draftedPickNumber - b.draftedPickNumber)
                            .map(player => (
                              <tr key={player.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {player.draftedPickNumber}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {player.name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.position}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.team}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {player.draftedSlotType}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                                  {teams.find(t => t.id === player.draftedBy)?.name || 'N/A'}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-4 py-4 text-center text-gray-500">No players drafted yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Rosters Section (below the main draft board for better flow on smaller screens) */}
      {draftStarted && (
        <div className="w-full mt-8">
          <button
            className="w-full text-left py-2 px-3 bg-white rounded-lg shadow-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
            onClick={() => toggleSection('teamRosters')}
          >
            Team Rosters
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${expandedSections.teamRosters ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {expandedSections.teamRosters && (
            <div className="transition-all duration-300 ease-in-out overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-3">{team.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Owner: {team.owner}</p>
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-700 mb-1">Roster Slots:</h4>
                      <ul className="text-sm text-gray-700 grid grid-cols-2 gap-x-4">
                        {Object.entries(team.rosterSlots).map(([slot, { current, max }]) => (
                          <li key={slot}>
                            {slot}: {current}/{max}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {team.roster.length > 0 ? (
                      <ul className="space-y-1">
                        {team.roster.map(player => (
                          <li key={player.id} className="text-sm text-gray-800">
                            • {player.name} ({player.position} - {player.team}) - <span className="text-gray-600 italic">{player.draftedSlotType}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Roster is empty.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <DraftConfirmationModal
          player={playerToDraft}
          team={teamToDraftTo}
          onConfirm={confirmDraft}
          onCancel={cancelDraftConfirmation}
        />
      )}
    </div>
  );
};

export default App;
