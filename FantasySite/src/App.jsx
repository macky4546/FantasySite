import React, { useState, useEffect, useRef } from 'react';
// Assuming Tailwind CSS is configured and available globally for styling

// Player Data with Tiers extracted from the provided CSV file (players.xlsx - Sheet1.csv)
// Team data has been manually added for each player.
const mockPlayersData = [
  { id: 1, name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', adp: 1.41, tier: 'Tier 1' },
  { id: 2, name: 'Bijan Robinson', position: 'RB', team: 'ATL', adp: 2.19, tier: 'Tier 1' },
  { id: 3, name: 'Saquon Barkley', position: 'RB', team: 'PHI', adp: 4.49, tier: 'Tier 1' },
  { id: 4, name: 'Justin Jefferson', position: 'WR', team: 'MIN', adp: 4.63, tier: 'Tier 1' },
  { id: 5, name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', adp: 5.17, tier: 'Tier 1' },
  { id: 6, name: 'CeeDee Lamb', position: 'WR', team: 'DAL', adp: 5.36, tier: 'Tier 1' },
  { id: 7, name: 'Puka Nacua', position: 'WR', team: 'LAR', adp: 8.71, tier: 'Tier 2' },
  { id: 8, name: 'Malik Nabers', position: 'WR', team: 'NYG', adp: 9.21, tier: 'Tier 2' },
  { id: 9, name: 'Nico Collins', position: 'WR', team: 'HOU', adp: 10.63, tier: 'Tier 2' },
  { id: 10, name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', adp: 11.33, tier: 'Tier 2' },
  { id: 11, name: 'Brian Thomas Jr.', position: 'WR', team: 'JAX', adp: 11.96, tier: 'Tier 2' },
  { id: 12, name: 'Christian McCaffrey', position: 'RB', team: 'SF', adp: 12.07, tier: 'Tier 2' },
  { id: 13, name: 'Ashton Jeanty', position: 'RB', team: 'N/A', adp: 12.29, tier: 'Tier 2' }, // College player, no NFL team yet
  { id: 14, name: 'Derrick Henry', position: 'RB', team: 'BAL', adp: 12.8, tier: 'Tier 2' },
  { id: 15, name: 'De\'Von Achane', position: 'RB', team: 'MIA', adp: 14.04, tier: 'Tier 2' },
  { id: 16, name: 'Drake London', position: 'WR', team: 'ATL', adp: 17.27, tier: 'Tier 3' },
  { id: 17, name: 'Brock Bowers', position: 'TE', team: 'LV', adp: 18.84, tier: 'Tier 3' },
  { id: 18, name: 'A.J. Brown', position: 'WR', team: 'PHI', adp: 19.19, tier: 'Tier 3' },
  { id: 19, name: 'Jonathan Taylor', position: 'RB', team: 'IND', adp: 20.61, tier: 'Tier 3' },
  { id: 20, name: 'Josh Jacobs', position: 'RB', team: 'GB', adp: 20.79, tier: 'Tier 3' },
  { id: 21, name: 'Bucky Irving', position: 'RB', team: 'TB', adp: 22.5, tier: 'Tier 3' },
  { id: 22, name: 'Ladd McConkey', position: 'WR', team: 'LAC', adp: 22.59, tier: 'Tier 3' },
  { id: 23, name: 'Trey McBride', position: 'TE', team: 'ARI', adp: 24.36, tier: 'Tier 4' },
  { id: 24, name: 'Chase Brown', position: 'RB', team: 'CIN', adp: 25.17, tier: 'Tier 4' },
  { id: 25, name: 'Josh Allen', position: 'QB', team: 'BUF', adp: 26.5, tier: 'Tier 4' },
  { id: 26, name: 'Lamar Jackson', position: 'QB', team: 'BAL', adp: 27.14, tier: 'Tier 5' },
  { id: 27, name: 'Kyren Williams', position: 'RB', team: 'LAR', adp: 27.53, tier: 'Tier 5' },
  { id: 28, name: 'Tee Higgins', position: 'WR', team: 'CIN', adp: 29.96, tier: 'Tier 5' },
  { id: 29, name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', adp: 30.03, tier: 'Tier 5' },
  { id: 30, name: 'Tyreek Hill', position: 'WR', team: 'MIA', adp: 30.07, tier: 'Tier 5' },
  { id: 31, name: 'Garrett Wilson', position: 'WR', team: 'NYJ', adp: 32.97, tier: 'Tier 6' },
  { id: 32, name: 'George Kittle', position: 'TE', team: 'SF', adp: 34.07, tier: 'Tier 6' },
  { id: 33, name: 'Jayden Daniels', position: 'QB', team: 'WAS', adp: 34.11, tier: 'Tier 6' },
  { id: 34, name: 'Davante Adams', position: 'WR', team: 'LV', adp: 34.56, tier: 'Tier 6' },
  { id: 35, name: 'Mike Evans', position: 'WR', team: 'TB', adp: 36.06, tier: 'Tier 6' },
  { id: 36, name: 'Breece Hall', position: 'RB', team: 'NYJ', adp: 36.3, tier: 'Tier 6' },
  { id: 37, name: 'Jalen Hurts', position: 'QB', team: 'PHI', adp: 36.87, tier: 'Tier 6' },
  { id: 38, name: 'James Cook', position: 'RB', team: 'BUF', adp: 38.13, tier: 'Tier 6' },
  { id: 39, name: 'Kenneth Walker III', position: 'RB', team: 'SEA', adp: 39.96, tier: 'Tier 7' },
  { id: 40, name: 'Terry McLaurin', position: 'WR', team: 'WAS', adp: 40.21, tier: 'Tier 7' },
  { id: 41, name: 'Marvin Harrison Jr.', position: 'WR', team: 'ARI', adp: 41.43, tier: 'Tier 7' },
  { id: 42, name: 'Alvin Kamara', position: 'RB', team: 'NO', adp: 41.46, tier: 'Tier 7' },
  { id: 43, name: 'DJ Moore', position: 'WR', team: 'CHI', adp: 44.06, tier: 'Tier 7' },
  { id: 44, name: 'Omarion Hampton', position: 'RB', team: 'N/A', adp: 44.5, tier: 'Tier 7' }, // College player
  { id: 45, name: 'Joe Burrow', position: 'QB', team: 'CIN', adp: 46.89, tier: 'Tier 8' },
  { id: 46, name: 'DK Metcalf', position: 'WR', team: 'SEA', adp: 47.61, tier: 'Tier 8' },
  { id: 47, name: 'Chuba Hubbard', position: 'RB', team: 'CAR', adp: 47.83, tier: 'Tier 8' },
  { id: 48, name: 'James Conner', position: 'RB', team: 'ARI', adp: 49.11, tier: 'Tier 8' },
  { id: 49, name: 'Courtland Sutton', position: 'WR', team: 'DEN', adp: 50.79, tier: 'Tier 8' },
  { id: 50, name: 'DeVonta Smith', position: 'WR', team: 'PHI', adp: 52.93, tier: 'Tier 8' },
  { id: 51, name: 'Zay Flowers', position: 'WR', team: 'BAL', adp: 55, tier: 'Tier 9' },
  { id: 52, name: 'Jameson Williams', position: 'WR', team: 'DET', adp: 55.86, tier: 'Tier 9' },
  { id: 53, name: 'David Montgomery', position: 'RB', team: 'DET', adp: 58.01, tier: 'Tier 9' },
  { id: 54, name: 'Xavier Worthy', position: 'WR', team: 'KC', adp: 58.14, tier: 'Tier 9' },
  { id: 55, name: 'Rashee Rice', position: 'WR', team: 'KC', adp: 59.13, tier: 'Tier 9' },
  { id: 56, name: 'D\'Andre Swift', position: 'RB', team: 'CHI', adp: 59.87, tier: 'Tier 9' },
  { id: 57, name: 'Jaylen Waddle', position: 'WR', team: 'MIA', adp: 61, tier: 'Tier 10' },
  { id: 58, name: 'Sam LaPorta', position: 'TE', team: 'DET', adp: 61.59, tier: 'Tier 10' },
  { id: 59, name: 'Tetairoa McMillan', position: 'WR', team: 'N/A', adp: 62.34, tier: 'Tier 10' }, // College player
  { id: 60, name: 'Calvin Ridley', position: 'WR', team: 'TEN', adp: 64.31, tier: 'Tier 10' },
  { id: 61, name: 'Aaron Jones Sr.', position: 'RB', team: 'MIN', adp: 65.1, tier: 'Tier 10' },
  { id: 62, name: 'George Pickens', position: 'WR', team: 'PIT', adp: 65.24, tier: 'Tier 10' },
  { id: 63, name: 'TreVeyon Henderson', position: 'RB', team: 'N/A', adp: 65.86, tier: 'Tier 10' }, // College player
  { id: 64, name: 'Patrick Mahomes II', position: 'QB', team: 'KC', adp: 65.96, tier: 'Tier 10' },
  { id: 65, name: 'Tony Pollard', position: 'RB', team: 'TEN', adp: 67.79, tier: 'Tier 11' },
  { id: 66, name: 'RJ Harvey', position: 'RB', team: 'N/A', adp: 68.64, tier: 'Tier 11' }, // College player
  { id: 67, name: 'Joe Mixon', position: 'RB', team: 'HOU', adp: 69.99, tier: 'Tier 11' },
  { id: 68, name: 'Isiah Pacheco', position: 'RB', team: 'KC', adp: 70.09, tier: 'Tier 11' },
  { id: 69, name: 'Chris Olave', position: 'WR', team: 'NO', adp: 70.41, tier: 'Tier 11' },
  { id: 70, name: 'Baker Mayfield', position: 'QB', team: 'TB', adp: 70.77, tier: 'Tier 11' },
  { id: 71, name: 'T.J. Hockenson', position: 'TE', team: 'MIN', adp: 72.43, tier: 'Tier 11' },
  { id: 72, name: 'Kaleb Johnson', position: 'RB', team: 'N/A', adp: 73.89, tier: 'Tier 11' }, // College player
  { id: 73, name: 'Travis Hunter', position: 'WR', team: 'N/A', adp: 74.59, tier: 'Tier 11' }, // College player
  { id: 74, name: 'Jerry Jeudy', position: 'WR', team: 'CLE', adp: 76, tier: 'Tier 12' },
  { id: 75, name: 'Brian Robinson Jr.', position: 'RB', team: 'WAS', adp: 77.64, tier: 'Tier 12' },
  { id: 76, name: 'Bo Nix', position: 'QB', team: 'DEN', adp: 78.01, tier: 'Tier 12' },
  { id: 77, name: 'Rome Odunze', position: 'WR', team: 'CHI', adp: 79.69, tier: 'Tier 12' },
  { id: 78, name: 'Kyler Murray', position: 'QB', team: 'ARI', adp: 80.7, tier: 'Tier 12' },
  { id: 79, name: 'Mark Andrews', position: 'TE', team: 'BAL', adp: 81.64, tier: 'Tier 12' },
  { id: 80, name: 'Travis Kelce', position: 'TE', team: 'KC', adp: 82.89, tier: 'Tier 12' },
  { id: 81, name: 'Jordan Addison', position: 'WR', team: 'MIN', adp: 85.9, tier: 'Tier 13' },
  { id: 82, name: 'Jakobi Meyers', position: 'WR', team: 'LV', adp: 86.59, tier: 'Tier 13' },
  { id: 83, name: 'Chris Godwin', position: 'WR', team: 'TB', adp: 87.07, tier: 'Tier 13' },
  { id: 84, name: 'Jaylen Warren', position: 'RB', team: 'PIT', adp: 89.2, tier: 'Tier 13' },
  { id: 85, name: 'David Njoku', position: 'TE', team: 'CLE', adp: 89.76, tier: 'Tier 13' },
  { id: 86, name: 'Justin Fields', position: 'QB', team: 'PIT', adp: 90.06, tier: 'Tier 13' },
  { id: 87, name: 'Evan Engram', position: 'TE', team: 'JAX', adp: 90.96, tier: 'Tier 13' },
  { id: 88, name: 'Jauan Jennings', position: 'WR', team: 'SF', adp: 91.29, tier: 'Tier 13' },
  { id: 89, name: 'Tyrone Tracy Jr.', position: 'RB', team: 'NYG', adp: 91.47, tier: 'Tier 13' },
  { id: 90, name: 'Brock Purdy', position: 'QB', team: 'SF', adp: 91.6, tier: 'Tier 13' },
  { id: 91, name: 'Stefon Diggs', position: 'WR', team: 'HOU', adp: 92.24, tier: 'Tier 13' },
  { id: 92, name: 'Dak Prescott', position: 'QB', team: 'DAL', adp: 93.47, tier: 'Tier 13' },
  { id: 93, name: 'Khalil Shakir', position: 'WR', team: 'BUF', adp: 95.43, tier: 'Tier 14' },
  { id: 94, name: 'Travis Etienne Jr.', position: 'RB', team: 'JAX', adp: 95.74, tier: 'Tier 14' },
  { id: 95, name: 'Jayden Reed', position: 'WR', team: 'GB', adp: 95.8, tier: 'Tier 14' },
  { id: 96, name: 'Justin Herbert', position: 'QB', team: 'LAC', adp: 97.13, tier: 'Tier 14' },
  { id: 97, name: 'Caleb Williams', position: 'QB', team: 'CHI', adp: 97.76, tier: 'Tier 14' },
  { id: 98, name: 'Deebo Samuel Sr.', position: 'WR', team: 'SF', adp: 98.5, tier: 'Tier 14' },
  { id: 99, name: 'Ricky Pearsall', position: 'WR', team: 'SF', adp: 99.73, tier: 'Tier 14' },
  { id: 100, name: 'Tucker Kraft', position: 'TE', team: 'GB', adp: 100.26, tier: 'Tier 14' },
  { id: 101, name: 'Josh Downs', position: 'WR', team: 'IND', adp: 102.53, tier: 'Tier 15' },
  { id: 102, name: 'Jared Goff', position: 'QB', team: 'DET', adp: 103.59, tier: 'Tier 15' },
  { id: 103, name: 'Javonte Williams', position: 'RB', team: 'DEN', adp: 104.67, tier: 'Tier 15' },
  { id: 104, name: 'Jordan Mason', position: 'RB', team: 'SF', adp: 105.24, tier: 'Tier 15' },
  { id: 105, name: 'Drake Maye', position: 'QB', team: 'NE', adp: 107.39, tier: 'Tier 16' },
  { id: 106, name: 'Jordan Love', position: 'QB', team: 'GB', adp: 108.17, tier: 'Tier 16' },
  { id: 107, name: 'Rhamondre Stevenson', position: 'RB', team: 'NE', adp: 108.31, tier: 'Tier 16' },
  { id: 108, name: 'Cam Skattebo', position: 'RB', team: 'N/A', adp: 109.36, tier: 'Tier 16' }, // College player
  { id: 109, name: 'Zach Charbonnet', position: 'RB', team: 'SEA', adp: 110.61, tier: 'Tier 16' },
  { id: 110, name: 'Najee Harris', position: 'RB', team: 'PIT', adp: 111.17, tier: 'Tier 16' },
  { id: 111, name: 'Cooper Kupp', position: 'WR', team: 'LAR', adp: 112.09, tier: 'Tier 16' },
  { id: 112, name: 'Quinshon Judkins', position: 'RB', team: 'N/A', adp: 112.66, tier: 'Tier 16' }, // College player
  { id: 113, name: 'Michael Pittman Jr.', position: 'WR', team: 'IND', adp: 113.41, tier: 'Tier 16' },
  { id: 114, name: 'Tyjae Spears', position: 'RB', team: 'TEN', adp: 114.29, tier: 'Tier 16' },
  { id: 115, name: 'Trevor Lawrence', position: 'QB', team: 'JAX', adp: 116.6, tier: 'Tier 17' },
  { id: 116, name: 'Tank Bigsby', position: 'RB', team: 'JAX', adp: 117.77, tier: 'Tier 17' },
  { id: 117, name: 'Jake Ferguson', position: 'TE', team: 'DAL', adp: 117.91, tier: 'Tier 17' },
  { id: 118, name: 'Dalton Kincaid', position: 'TE', team: 'BUF', adp: 118.73, tier: 'Tier 17' },
  { id: 119, name: 'Darnell Mooney', position: 'WR', team: 'ATL', adp: 119.84, tier: 'Tier 17' },
  { id: 120, name: 'Rachaad White', position: 'RB', team: 'TB', adp: 120.11, tier: 'Tier 17' },
  { id: 121, name: 'Emeka Egbuka', position: 'WR', team: 'N/A', adp: 120.4, tier: 'Tier 17' }, // College player
  { id: 122, name: 'C.J. Stroud', position: 'QB', team: 'HOU', adp: 121.47, tier: 'Tier 17' },
  { id: 123, name: 'Tyler Warren', position: 'TE', team: 'N/A', adp: 122.19, tier: 'Tier 17' }, // College player
  { id: 124, name: 'Dallas Goedert', position: 'TE', team: 'PHI', adp: 124.96, tier: 'Tier 17' },
  { id: 125, name: 'Brandon Aiyuk', position: 'WR', team: 'SF', adp: 126.79, tier: 'Tier 18' },
  { id: 126, name: 'J.K. Dobbins', position: 'RB', team: 'LAC', adp: 121.1, tier: 'Tier 17' },
  { id: 127, name: 'J.J. McCarthy', position: 'QB', team: 'MIN', adp: 127.33, tier: 'Tier 18' },
  { id: 128, name: 'Rashid Shaheed', position: 'WR', team: 'NO', adp: 133.17, tier: 'Tier 18' },
  { id: 129, name: 'Matthew Golden', position: 'WR', team: 'N/A', adp: 121.93, tier: 'Tier 17' }, // College player
  { id: 130, name: 'Keon Coleman', position: 'WR', team: 'BUF', adp: 134.03, tier: 'Tier 18' },
  { id: 131, name: 'Austin Ekeler', position: 'RB', team: 'WAS', adp: 135.84, tier: 'Tier 19' },
  { id: 132, name: 'Colston Loveland', position: 'TE', team: 'N/A', adp: 138.13, tier: 'Tier 19' }, // College player
  { id: 133, name: 'Ray Davis', position: 'RB', team: 'BUF', adp: 136.26, tier: 'Tier 19' },
  { id: 134, name: 'Christian Kirk', position: 'WR', team: 'JAX', adp: 142.34, tier: 'Tier 20' },
  { id: 135, name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', adp: 140.12, tier: 'Tier 19' },
  { id: 136, name: 'Rashod Bateman', position: 'WR', team: 'BAL', adp: 146.29, tier: 'Tier 20' },
  { id: 137, name: 'Jerome Ford', position: 'RB', team: 'CLE', adp: 146.64, tier: 'Tier 20' },
  { id: 138, name: 'Kyle Pitts Sr.', position: 'TE', team: 'ATL', adp: 148.66, tier: 'Tier 20' },
  { id: 139, name: 'Tyler Allgeier', position: 'RB', team: 'ATL', adp: 145.16, tier: 'Tier 20' },
  { id: 140, name: 'Matthew Stafford', position: 'QB', team: 'LAR', adp: 145.28, tier: 'Tier 20' },
  { id: 141, name: 'Isaac Guerendo', position: 'RB', team: 'SF', adp: 147.13, tier: 'Tier 20' },
  { id: 142, name: 'Jonnu Smith', position: 'TE', team: 'MIA', adp: 147.51, tier: 'Tier 20' },
  { id: 143, name: 'Trey Benson', position: 'RB', team: 'ARI', adp: 142.5, tier: 'Tier 20' },
  { id: 144, name: 'Luther Burden III', position: 'WR', team: 'N/A', adp: 148.42, tier: 'Tier 20' }, // College player
  { id: 145, name: 'Cedric Tillman', position: 'WR', team: 'CLE', adp: 150.72, tier: 'Tier 20' },
  { id: 146, name: 'Hunter Henry', position: 'TE', team: 'NE', adp: 150.91, tier: 'Tier 20' },
  { id: 147, name: 'Michael Penix Jr.', position: 'QB', team: 'ATL', adp: 157.04, tier: 'Tier 21' },
  { id: 148, name: 'Bryce Young', position: 'QB', team: 'CAR', adp: 152.07, tier: 'Tier 20' },
  { id: 149, name: 'Braelon Allen', position: 'RB', team: 'NYJ', adp: 152.29, tier: 'Tier 20' },
  { id: 150, name: 'Jaydon Blue', position: 'RB', team: 'N/A', adp: 158.42, tier: 'Tier 21' }, // College player
  { id: 151, name: 'Marvin Mims Jr.', position: 'WR', team: 'DEN', adp: 155.58, tier: 'Tier 21' },
  { id: 152, name: 'Rico Dowdle', position: 'RB', team: 'DAL', adp: 149.9, tier: 'Tier 20' },
  { id: 153, name: 'Tre\' Harris', position: 'WR', team: 'N/A', adp: 155.99, tier: 'Tier 21' }, // College player
  { id: 154, name: 'Marquise Brown', position: 'WR', team: 'KC', adp: 158.43, tier: 'Tier 21' },
  { id: 155, name: 'Romeo Doubs', position: 'WR', team: 'GB', adp: 166.19, tier: 'Tier 22' },
  { id: 156, name: 'Zach Ertz', position: 'TE', team: 'WAS', adp: 166.96, tier: 'Tier 22' },
  { id: 157, name: 'Nick Chubb', position: 'RB', team: 'CLE', adp: 159.31, tier: 'Tier 21' },
  { id: 158, name: 'Adam Thielen', position: 'WR', team: 'CAR', adp: 172.29, tier: 'Tier 23' },
  { id: 159, name: 'Jaylen Wright', position: 'RB', team: 'MIA', adp: 156.28, tier: 'Tier 21' },
  { id: 160, name: 'Jalen McMillan', position: 'WR', team: 'TB', adp: 173.16, tier: 'Tier 23' },
  { id: 161, name: 'Kyle Williams', position: 'WR', team: 'N/A', adp: 174.44, tier: 'Tier 23' }, // College player
  { id: 162, name: 'Geno Smith', position: 'QB', team: 'SEA', adp: 169.26, tier: 'Tier 22' },
  { id: 163, name: 'Jayden Higgins', position: 'WR', team: 'N/A', adp: 158.15, tier: 'Tier 21' }, // College player
  { id: 164, name: 'Bhayshul Tuten', position: 'RB', team: 'N/A', adp: 158.19, tier: 'Tier 21' }, // College player
  { id: 165, name: 'Wan\'Dale Robinson', position: 'WR', team: 'NYG', adp: 172, tier: 'Tier 23' },
  { id: 166, name: 'Quentin Johnston', position: 'WR', team: 'LAC', adp: 167.01, tier: 'Tier 22' },
  { id: 167, name: 'Dylan Sampson', position: 'RB', team: 'N/A', adp: 163.09, tier: 'Tier 21' }, // College player
  { id: 168, name: 'DeMario Douglas', position: 'WR', team: 'NE', adp: 183.86, tier: 'Tier 24' },
  { id: 169, name: 'Roschon Johnson', position: 'RB', team: 'CHI', adp: 162.26, tier: 'Tier 21' },
  { id: 170, name: 'Brenton Strange', position: 'TE', team: 'JAX', adp: 178.4, tier: 'Tier 23' },
  { id: 171, name: 'Xavier Legette', position: 'WR', team: 'CAR', adp: 183.94, tier: 'Tier 24' },
  { id: 172, name: 'Blake Corum', position: 'RB', team: 'LAR', adp: 180.85, tier: 'Tier 24' },
  { id: 173, name: 'Isaiah Likely', position: 'TE', team: 'BAL', adp: 188.07, tier: 'Tier 24' },
  { id: 174, name: 'Sam Darnold', position: 'QB', team: 'MIN', adp: 184.51, tier: 'Tier 24' },
  { id: 175, name: 'Cameron Ward', position: 'QB', team: 'N/A', adp: 195.74, tier: 'Tier 25' }, // College player
  { id: 176, name: 'Joshua Palmer', position: 'WR', team: 'LAC', adp: 188.13, tier: 'Tier 24' },
  { id: 177, name: 'MarShawn Lloyd', position: 'RB', team: 'GB', adp: 185.03, tier: 'Tier 24' },
  { id: 178, name: 'Denver Broncos', position: 'DST', team: 'DEN', adp: 156.24, tier: 'Tier 21' },
  { id: 179, name: 'Philadelphia Eagles', position: 'DST', team: 'PHI', adp: 166.73, tier: 'Tier 22' },
  { id: 180, name: 'DeAndre Hopkins', position: 'WR', team: 'TEN', adp: 192.45, tier: 'Tier 24' },
  { id: 181, name: 'Pat Freiermuth', position: 'TE', team: 'PIT', adp: 197.79, tier: 'Tier 25' },
  { id: 182, name: 'Pittsburgh Steelers', position: 'DST', team: 'PIT', adp: 170.76, tier: 'Tier 22' },
  { id: 183, name: 'Minnesota Vikings', position: 'DST', team: 'MIN', adp: 177.35, tier: 'Tier 23' },
  { id: 184, name: 'Mike Gesicki', position: 'TE', team: 'CIN', adp: 195.02, tier: 'Tier 25' },
  { id: 185, name: 'Mason Taylor', position: 'TE', team: 'N/A', adp: 216.36, tier: 'Tier 26' }, // College player
  { id: 186, name: 'Baltimore Ravens', position: 'DST', team: 'BAL', adp: 174.39, tier: 'Tier 23' },
  { id: 187, name: 'Chig Okonkwo', position: 'TE', team: 'TEN', adp: 207.78, tier: 'Tier 26' },
  { id: 188, name: 'Jack Bech', position: 'WR', team: 'N/A', adp: 198.48, tier: 'Tier 25' }, // College player
  { id: 189, name: 'Alec Pierce', position: 'WR', team: 'IND', adp: 199.14, tier: 'Tier 25' },
  { id: 190, name: 'Cade Otton', position: 'TE', team: 'TB', adp: 206.36, tier: 'Tier 26' },
  { id: 191, name: 'Aaron Rodgers', position: 'QB', team: 'NYJ', adp: 209.3, tier: 'Tier 26' },
  { id: 192, name: 'Houston Texans', position: 'DST', team: 'HOU', adp: 187.81, tier: 'Tier 24' },
  { id: 193, name: 'Michael Wilson', position: 'WR', team: 'ARI', adp: 204.42, tier: 'Tier 25' },
  { id: 194, name: 'Kareem Hunt', position: 'RB', team: 'N/A', adp: 201.58, tier: 'Tier 25' }, // Free Agent
  { id: 195, name: 'Kansas City Chiefs', position: 'DST', team: 'KC', adp: 190.65, tier: 'Tier 24' },
  { id: 196, name: 'Dontayvion Wicks', position: 'WR', team: 'GB', adp: 217.6, tier: 'Tier 26' },
  { id: 197, name: 'Detroit Lions', position: 'DST', team: 'DET', adp: 191.48, tier: 'Tier 24' },
  { id: 198, name: 'Jalen Coker', position: 'WR', team: 'N/A', adp: 209.15, tier: 'Tier 26' }, // College player
  { id: 199, name: 'Buffalo Bills', position: 'DST', team: 'BUF', adp: 188.61, tier: 'Tier 24' },
  { id: 200, name: 'Brandon Aubrey', position: 'K', team: 'DAL', adp: 189.46, tier: 'Tier 24' },
];

// Updated initialTeams based on the provided image, including roster slots
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
  const [players, setPlayers] = useState([]); // Initialize as empty array
  const [teams, setTeams] = useState(initialTeams);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [draftStarted, setDraftStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToDraft, setPlayerToDraft] = useState(null);
  const [teamToDraftTo, setTeamToDraftTo] = useState(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [draftHistory, setDraftHistory] = useState([]);
  const [expandedTiers, setExpandedTiers] = useState({}); // State to manage collapsible player tiers
  const [expandedSections, setExpandedSections] = useState({ // State to manage collapsible main sections
    draftStatus: true,
    aiInsights: true,
    draftedPlayers: true,
    teamRosters: true,
  });
  const [message, setMessage] = useState(''); // New state for messages (e.g., roster full)
  const messageTimeoutRef = useRef(null); // Ref for message timeout

  // Ref for the player list container to scroll to top on search/filter changes
  const playerListRef = useRef(null);

  useEffect(() => {
    const fetchPlayers = () => {
      // Simulate fetching data from an API endpoint or a backend proxy
      setTimeout(() => {
        setPlayers(mockPlayersData);
        setIsLoadingPlayers(false);
      }, 1500); // Simulate network delay
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    // Generate initial draft order for a snake draft (2 rounds for example)
    const generateDraftOrder = () => {
      const order = [];
      const numTeams = teams.length;
      const numRounds = 15; // Standard fantasy football draft rounds

      for (let round = 0; round < numRounds; round++) {
        if (round % 2 === 0) {
          // Odd rounds: 1 -> N
          for (let i = 0; i < numTeams; i++) {
            order.push(teams[i].id);
          }
        } else {
          // Even rounds: N -> 1
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

  // Get the current team on the clock
  const currentTeamId = draftOrder[currentPickIndex];
  const currentTeam = teams.find(team => team.id === currentTeamId);

  // Function to display a temporary message
  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, 3000); // Message disappears after 3 seconds
  };

  // Filter players based on search term and availability
  const availablePlayers = players.filter(player =>
    !player.isDrafted &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group available players by tier and then sort players within each tier by position
  const playersByTier = availablePlayers.reduce((acc, player) => {
    const tierName = player.tier || 'Uncategorized'; // Default tier if not specified
    if (!acc[tierName]) {
      acc[tierName] = [];
    }
    acc[tierName].push(player);
    return acc;
  }, {});

  // Sort tiers (e.g., numerically based on "Tier X" prefix, then alphabetically)
  const sortedTiers = Object.keys(playersByTier).sort((a, b) => {
    const tierNumA = parseInt(a.match(/Tier (\d+)/)?.[1]) || Infinity;
    const tierNumB = parseInt(b.match(/Tier (\d+)/)?.[1]) || Infinity;
    if (tierNumA !== tierNumB) {
      return tierNumA - tierNumB;
    }
    return a.localeCompare(b); // Fallback for other tier names
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (playerListRef.current) {
      playerListRef.current.scrollTop = 0;
    }
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    // Ensure players are sorted by ADP when draft starts
    setPlayers(prevPlayers => [...prevPlayers].sort((a, b) => a.adp - b.adp));
    // Expand all player tiers by default when draft starts
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

    // Try to fill primary position slot
    if (currentRoster[player.position] && currentRoster[player.position].current < currentRoster[player.position].max) {
      slotFound = true;
      draftedSlotType = player.position;
    }
    // Try to fill FLEX slot for RB/WR/TE
    else if (['RB', 'WR', 'TE'].includes(player.position) && currentRoster.FLEX.current < currentRoster.FLEX.max) {
      slotFound = true;
      draftedSlotType = 'FLEX';
    }
    // Try to fill Bench slot
    else if (currentRoster.Bench.current < currentRoster.Bench.max) {
      slotFound = true;
      draftedSlotType = 'Bench';
    }

    if (slotFound) {
      setPlayerToDraft({ ...player, draftedSlotType }); // Store the slot type for undo
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
          // Increment the count for the slot type where the player was drafted
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
    setSearchTerm(''); // Clear search after drafting
    setShowConfirmation(false);
    setPlayerToDraft(null);
    setTeamToDraftTo(null);
  };

  const handleUndoLastPick = () => {
    if (draftHistory.length === 0) return; // Nothing to undo

    const lastPick = draftHistory[draftHistory.length - 1];
    const { player: lastDraftedPlayer, team: draftingTeam } = lastPick;

    // 1. Mark player as undrafted
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === lastDraftedPlayer.id ? { ...p, isDrafted: false, draftedBy: undefined, draftedPickNumber: undefined, draftedSlotType: undefined } : p
      )
    );

    // 2. Remove player from team's roster and decrement slot count
    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id === draftingTeam.id) {
          const updatedRosterSlots = { ...t.rosterSlots };
          // Decrement the count for the slot type where the player was originally drafted
          if (updatedRosterSlots[lastDraftedPlayer.draftedSlotType]) {
            updatedRosterSlots[lastDraftedPlayer.draftedSlotType].current--;
          }
          return { ...t, roster: t.roster.filter(p => p.id !== lastDraftedPlayer.id), rosterSlots: updatedRosterSlots };
        }
        return t;
      })
    );

    // 3. Decrement current pick index
    setCurrentPickIndex(prevIndex => Math.max(0, prevIndex - 1));

    // 4. Remove last pick from history
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
    if (!player || !team) return null; // Ensure player and team are available

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
        NFL Fantasy Draft Board
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
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button
                className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
                onClick={() => toggleSection('aiInsights')}
              >
                AI Insights (Conceptual)
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${expandedSections.aiInsights ? 'rotate-90' : ''}`}
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
              {expandedSections.aiInsights && (
                <div className="transition-all duration-300 ease-in-out overflow-hidden">
                  <p className="text-gray-700 mb-3">
                    Integrating AI can significantly enhance your draft strategy, especially with tiers. Here's how:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>
                      <span className="font-semibold">Dynamic Tier Generation:</span> An AI model could analyze real-time player data (performance, injuries, news), consensus rankings, and your league's specific scoring settings (e.g., PPR, Half-PPR) to generate highly customized and up-to-date tiers. This goes beyond static tiers by adapting to changing circumstances.
                    </li>
                    <li>
                      <span className="font-semibold">Tier Drop-off Alerts:</span> The AI could proactively alert you when there's a significant "drop-off" in talent within a position (i.e., the last few players in a tier are about to be drafted). This helps you decide whether to grab a player now or risk losing out on a valuable tier.
                    </li>
                    <li>
                      <span className="font-semibold">Value Picks & Recommendations:</span> Based on your team's current roster and needs, and considering the remaining players in each tier, the AI could recommend the "best available" player or suggest a player who offers the most value at your current pick.
                    </li>
                    <li>
                      <span className="font-semibold">Positional Scarcity Analysis:</span> AI could analyze the depth of talent remaining in each position's tiers across the entire draft board, helping you decide if you need to prioritize a scarce position (like top-tier running backs) or if you can afford to wait on a deeper position (like wide receivers).
                    </li>
                    <li>
                      <span className="font-semibold">Opponent Analysis:</span> In more advanced scenarios, AI could analyze your opponents' drafted rosters and suggest players who might counter their strengths or fill gaps that align with a "best player available" or "team need" strategy.
                    </li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    *Note: Implementing these advanced AI capabilities would typically require a backend server to process large datasets and integrate with LLMs or other machine learning models, as direct client-side fetching from external sites is limited by browser security policies (CORS).
                  </p>
                </div>
              )}
            </div>


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
        <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg mt-8">
          <button
            className="w-full text-left py-2 px-3 bg-gray-100 rounded-lg flex justify-between items-center text-gray-800 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out mb-4"
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
