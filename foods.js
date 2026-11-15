// Built-in whole foods. Values per 100 g (standard USDA-style reference values).
// [name, kcal, protein, carbs, fat, servingLabel, servingGrams]
const BASE_RAW = [
  // Eggs, meat, fish
  ['Egg, whole', 143, 12.6, 0.7, 9.5, '1 large egg', 50],
  ['Egg, boiled', 155, 12.6, 1.1, 10.6, '1 egg', 50],
  ['Egg white', 52, 10.9, 0.7, 0.2, '1 egg white', 33],
  ['Chicken breast, raw', 120, 22.5, 0, 2.6],
  ['Chicken breast, cooked', 165, 31, 0, 3.6],
  ['Chicken thigh, cooked (skinless)', 209, 26, 0, 10.9],
  ['Turkey breast, cooked', 135, 30, 0, 1],
  ['Beef, lean ground (5% fat), cooked', 171, 26, 0, 6.5],
  ['Beef, ground (15% fat), cooked', 250, 26, 0, 15],
  ['Beef steak, sirloin, cooked', 206, 27, 0, 10],
  ['Pork tenderloin, cooked', 143, 26, 0, 3.5],
  ['Ham, sliced', 113, 18, 1.5, 4, '1 slice', 20],
  ['Bacon, cooked', 541, 37, 1.4, 42, '1 slice', 8],
  ['Salmon', 208, 20, 0, 13],
  ['Tuna, canned in water', 116, 26, 0, 1],
  ['Cod', 82, 18, 0, 0.7],
  ['Shrimp, cooked', 99, 24, 0.2, 0.3],
  ['Tofu, firm', 144, 17, 3, 9],
  ['Lentils, cooked', 116, 9, 20, 0.4],
  ['Chickpeas, cooked', 164, 8.9, 27, 2.6],
  ['Kidney beans, cooked', 127, 8.7, 22.8, 0.5],
  ['Black beans, cooked', 132, 8.9, 23.7, 0.5],
  ['Whey protein powder (typical)', 380, 78, 7, 6, '1 scoop', 30],
  // Dairy
  ['Milk, whole (3.5%)', 61, 3.2, 4.8, 3.3, '1 glass', 250],
  ['Milk, semi-skimmed (1.5%)', 47, 3.4, 4.9, 1.5, '1 glass', 250],
  ['Milk, skimmed', 34, 3.4, 5, 0.1, '1 glass', 250],
  ['Greek yogurt, 0% fat', 59, 10, 3.6, 0.4],
  ['Greek yogurt, full fat', 97, 9, 4, 5],
  ['Yogurt, plain', 61, 3.5, 4.7, 3.3],
  ['Cottage cheese', 98, 11, 3.4, 4.3],
  ['Cottage cheese, low fat', 72, 12, 2.7, 1],
  ['Quark (tvaroh), low fat', 67, 12, 4, 0.3],
  ['Cheddar cheese', 403, 25, 1.3, 33, '1 slice', 20],
  ['Edam / Gouda cheese', 356, 25, 2.2, 27, '1 slice', 20],
  ['Mozzarella', 280, 22, 2.2, 20],
  ['Feta cheese', 264, 14, 4, 21],
  ['Parmesan', 431, 38, 4, 29, '1 tbsp grated', 5],
  ['Cream cheese', 342, 6, 4, 34, '1 tbsp', 15],
  ['Butter', 717, 0.9, 0.1, 81, '1 tsp', 5],
  ['Sour cream', 198, 2.4, 4.6, 19, '1 tbsp', 15],
  ['Heavy cream', 340, 2.8, 2.8, 36, '1 tbsp', 15],
  // Grains & starches
  ['Rice, white, cooked', 130, 2.7, 28, 0.3],
  ['Rice, white, dry', 365, 7, 80, 0.7],
  ['Rice, brown, cooked', 123, 2.7, 25.6, 1],
  ['Pasta, cooked', 158, 5.8, 31, 0.9],
  ['Pasta, dry', 371, 13, 75, 1.5],
  ['Oats, rolled', 379, 13, 68, 6.5],
  ['Bread, white', 265, 9, 49, 3.2, '1 slice', 30],
  ['Bread, whole wheat', 247, 13, 41, 3.4, '1 slice', 30],
  ['Bread, rye', 259, 8.5, 48, 3.3, '1 slice', 30],
  ['Tortilla, wheat', 310, 8, 51, 8, '1 tortilla', 45],
  ['Quinoa, cooked', 120, 4.4, 21.3, 1.9],
  ['Couscous, cooked', 112, 3.8, 23, 0.2],
  ['Bulgur, cooked', 83, 3.1, 18.6, 0.2],
  ['Buckwheat, cooked', 92, 3.4, 20, 0.6],
  ['Potato, raw', 77, 2, 17, 0.1, '1 medium', 170],
  ['Potato, boiled', 87, 1.9, 20, 0.1, '1 medium', 150],
  ['Sweet potato, raw', 86, 1.6, 20, 0.1],
  ['Sweet potato, baked', 90, 2, 20.7, 0.2],
  ['Cornflakes', 357, 7.5, 84, 0.4],
  ['Rice cakes', 387, 8, 82, 2.8, '1 cake', 9],
  // Fruit
  ['Apple', 52, 0.3, 14, 0.2, '1 medium', 180],
  ['Banana', 89, 1.1, 23, 0.3, '1 medium', 120],
  ['Orange', 47, 0.9, 12, 0.1, '1 medium', 130],
  ['Mandarin', 53, 0.8, 13, 0.3, '1 piece', 75],
  ['Strawberries', 32, 0.7, 7.7, 0.3],
  ['Blueberries', 57, 0.7, 14.5, 0.3],
  ['Raspberries', 52, 1.2, 12, 0.7],
  ['Grapes', 69, 0.7, 18, 0.2],
  ['Watermelon', 30, 0.6, 7.6, 0.2],
  ['Pear', 57, 0.4, 15, 0.1, '1 medium', 180],
  ['Peach', 39, 0.9, 9.5, 0.3, '1 medium', 150],
  ['Plum', 46, 0.7, 11.4, 0.3, '1 piece', 65],
  ['Kiwi', 61, 1.1, 14.7, 0.5, '1 piece', 70],
  ['Pineapple', 50, 0.5, 13, 0.1],
  ['Mango', 60, 0.8, 15, 0.4],
  ['Cherries', 63, 1.1, 16, 0.2],
  ['Grapefruit', 42, 0.8, 10.7, 0.1],
  ['Lemon', 29, 1.1, 9.3, 0.3],
  ['Avocado', 160, 2, 8.5, 14.7, '½ avocado', 75],
  ['Dates', 277, 1.8, 75, 0.2, '1 date', 24],
  ['Raisins', 299, 3.1, 79, 0.5],
  // Vegetables
  ['Tomato', 18, 0.9, 3.9, 0.2, '1 medium', 120],
  ['Cucumber', 15, 0.7, 3.6, 0.1],
  ['Carrot', 41, 0.9, 9.6, 0.2, '1 medium', 60],
  ['Broccoli', 34, 2.8, 6.6, 0.4],
  ['Cauliflower', 25, 1.9, 5, 0.3],
  ['Spinach', 23, 2.9, 3.6, 0.4],
  ['Lettuce', 15, 1.4, 2.9, 0.2],
  ['Bell pepper', 31, 1, 6, 0.3, '1 medium', 150],
  ['Onion', 40, 1.1, 9.3, 0.1, '1 medium', 110],
  ['Garlic', 149, 6.4, 33, 0.5, '1 clove', 3],
  ['Zucchini', 17, 1.2, 3.1, 0.3],
  ['Mushrooms', 22, 3.1, 3.3, 0.3],
  ['Green beans', 31, 1.8, 7, 0.2],
  ['Peas', 81, 5.4, 14.5, 0.4],
  ['Sweet corn', 86, 3.3, 19, 1.4],
  ['Cabbage', 25, 1.3, 5.8, 0.1],
  ['Eggplant', 25, 1, 5.9, 0.2],
  ['Beetroot', 43, 1.6, 9.6, 0.2],
  ['Asparagus', 20, 2.2, 3.9, 0.1],
  ['Radish', 16, 0.7, 3.4, 0.1],
  ['Pumpkin', 26, 1, 6.5, 0.1],
  // Nuts, seeds, fats
  ['Almonds', 579, 21, 22, 50],
  ['Walnuts', 654, 15, 14, 65],
  ['Cashews', 553, 18, 30, 44],
  ['Peanuts', 567, 26, 16, 49],
  ['Hazelnuts', 628, 15, 17, 61],
  ['Pistachios', 560, 20, 28, 45],
  ['Peanut butter', 588, 25, 20, 50, '1 tbsp', 16],
  ['Chia seeds', 486, 17, 42, 31, '1 tbsp', 12],
  ['Flax seeds', 534, 18, 29, 42, '1 tbsp', 10],
  ['Sunflower seeds', 584, 21, 20, 51],
  ['Pumpkin seeds', 559, 30, 11, 49],
  ['Olive oil', 884, 0, 0, 100, '1 tbsp', 14],
  ['Sunflower oil', 884, 0, 0, 100, '1 tbsp', 14],
  ['Coconut oil', 892, 0, 0, 99, '1 tbsp', 14],
  ['Olives', 115, 0.8, 6, 10.7],
  ['Hummus', 166, 7.9, 14, 9.6, '1 tbsp', 15],
  ['Mayonnaise', 680, 1, 0.6, 75, '1 tbsp', 14],
  // Sweet things & condiments
  ['Honey', 304, 0.3, 82, 0, '1 tsp', 7],
  ['Sugar', 387, 0, 100, 0, '1 tsp', 4],
  ['Maple syrup', 260, 0, 67, 0, '1 tbsp', 20],
  ['Jam', 278, 0.4, 69, 0.1, '1 tbsp', 20],
  ['Dark chocolate (70%)', 598, 7.8, 46, 43, '1 square', 10],
  ['Milk chocolate', 535, 7.7, 59, 30, '1 square', 10],
  ['Ketchup', 101, 1, 27, 0.1, '1 tbsp', 17],
  ['Mustard', 60, 3.7, 5.8, 3.3, '1 tsp', 5],
  // Drinks
  ['Orange juice', 45, 0.7, 10.4, 0.2, '1 glass', 250],
  ['Apple juice', 46, 0.1, 11.3, 0.1, '1 glass', 250],
  ['Coffee, black', 1, 0.1, 0, 0, '1 cup', 240],
  ['Cola', 42, 0, 10.6, 0, '1 can', 330],
  ['Beer', 43, 0.5, 3.6, 0, '1 large (0.5 l)', 500],
  ['Wine, red', 85, 0.1, 2.6, 0, '1 glass', 150],
  ['Wine, white', 82, 0.1, 2.6, 0, '1 glass', 150],
  ['Oat milk', 46, 1, 6.7, 1.5, '1 glass', 250],
  ['Almond milk, unsweetened', 15, 0.6, 0.3, 1.2, '1 glass', 250],
  ['Soy milk, unsweetened', 33, 2.9, 1.7, 1.6, '1 glass', 250],
];

// Fiber per 100 g for the foods above (anything not listed has none).
const FIBER = {
  'Tofu, firm': 2.3, 'Lentils, cooked': 7.9, 'Chickpeas, cooked': 7.6, 'Kidney beans, cooked': 6.4, 'Black beans, cooked': 8.7,
  'Rice, white, cooked': 0.4, 'Rice, white, dry': 1.3, 'Rice, brown, cooked': 1.8, 'Pasta, cooked': 1.8, 'Pasta, dry': 3.2, 'Oats, rolled': 10,
  'Bread, white': 2.7, 'Bread, whole wheat': 7, 'Bread, rye': 5.8, 'Tortilla, wheat': 3, 'Quinoa, cooked': 2.8, 'Couscous, cooked': 1.4,
  'Bulgur, cooked': 4.5, 'Buckwheat, cooked': 2.7, 'Potato, raw': 2.2, 'Potato, boiled': 1.8, 'Sweet potato, raw': 3, 'Sweet potato, baked': 3.3,
  'Cornflakes': 3.3, 'Rice cakes': 4.2,
  'Apple': 2.4, 'Banana': 2.6, 'Orange': 2.4, 'Mandarin': 1.8, 'Strawberries': 2, 'Blueberries': 2.4, 'Raspberries': 6.5, 'Grapes': 0.9,
  'Watermelon': 0.4, 'Pear': 3.1, 'Peach': 1.5, 'Plum': 1.4, 'Kiwi': 3, 'Pineapple': 1.4, 'Mango': 1.6, 'Cherries': 2.1, 'Grapefruit': 1.6,
  'Lemon': 2.8, 'Avocado': 6.7, 'Dates': 6.7, 'Raisins': 3.7,
  'Tomato': 1.2, 'Cucumber': 0.5, 'Carrot': 2.8, 'Broccoli': 2.6, 'Cauliflower': 2, 'Spinach': 2.2, 'Lettuce': 1.3, 'Bell pepper': 2.1,
  'Onion': 1.7, 'Garlic': 2.1, 'Zucchini': 1, 'Mushrooms': 1, 'Green beans': 2.7, 'Peas': 5.7, 'Sweet corn': 2, 'Cabbage': 2.5, 'Eggplant': 3,
  'Beetroot': 2.8, 'Asparagus': 2.1, 'Radish': 1.6, 'Pumpkin': 0.5,
  'Almonds': 12.5, 'Walnuts': 6.7, 'Cashews': 3.3, 'Peanuts': 8.5, 'Hazelnuts': 9.7, 'Pistachios': 10.6, 'Peanut butter': 6, 'Chia seeds': 34.4,
  'Flax seeds': 27.3, 'Sunflower seeds': 8.6, 'Pumpkin seeds': 6, 'Olives': 3.2, 'Hummus': 6,
  'Honey': 0.2, 'Jam': 1.1, 'Dark chocolate (70%)': 10.9, 'Milk chocolate': 3.4, 'Ketchup': 0.3, 'Mustard': 4,
  'Orange juice': 0.2, 'Apple juice': 0.2, 'Oat milk': 0.8, 'Almond milk, unsweetened': 0.2, 'Soy milk, unsweetened': 0.4,
};

// For the health grade: [sugars g, saturated fat g, salt g, fruit/veg/pulses/nuts %, type] per 100 g.
// type: 'bev' = drink, 'fat' = oil or butter, 'cheese', 'none' = not graded (alcohol). Foods not listed: all zero.
const FV = 100;
const NUTRI = {
  'Egg, whole': [0.4, 3.1, 0.36], 'Egg, boiled': [1.1, 3.3, 0.31], 'Egg white': [0.7, 0, 0.42],
  'Chicken breast, raw': [0, 0.6, 0.11], 'Chicken breast, cooked': [0, 1, 0.19], 'Chicken thigh, cooked (skinless)': [0, 3, 0.22],
  'Turkey breast, cooked': [0, 0.3, 0.13], 'Beef, lean ground (5% fat), cooked': [0, 2.9, 0.16], 'Beef, ground (15% fat), cooked': [0, 5.9, 0.18],
  'Beef steak, sirloin, cooked': [0, 4, 0.14], 'Pork tenderloin, cooked': [0, 1.2, 0.14], 'Ham, sliced': [1, 1.3, 2.6], 'Bacon, cooked': [0, 14, 4.3],
  'Salmon': [0, 3.1, 0.15], 'Tuna, canned in water': [0, 0.2, 0.8], 'Cod': [0, 0.1, 0.14], 'Shrimp, cooked': [0, 0.1, 0.28],
  'Tofu, firm': [0.6, 1.3, 0.04], 'Lentils, cooked': [1.8, 0.1, 0.01, FV], 'Chickpeas, cooked': [4.8, 0.3, 0.02, FV],
  'Kidney beans, cooked': [0.3, 0.1, 0.01, FV], 'Black beans, cooked': [0.3, 0.1, 0.01, FV], 'Whey protein powder (typical)': [5, 3, 0.5],
  'Milk, whole (3.5%)': [4.8, 1.9, 0.11], 'Milk, semi-skimmed (1.5%)': [4.9, 0.9, 0.11], 'Milk, skimmed': [5, 0.1, 0.11],
  'Greek yogurt, 0% fat': [3.6, 0.1, 0.09], 'Greek yogurt, full fat': [4, 3.2, 0.09], 'Yogurt, plain': [4.7, 2.1, 0.12],
  'Cottage cheese': [2.7, 1.7, 0.9, 0, 'cheese'], 'Cottage cheese, low fat': [2.7, 0.6, 0.9, 0, 'cheese'], 'Quark (tvaroh), low fat': [4, 0.2, 0.1, 0, 'cheese'],
  'Cheddar cheese': [0.5, 19, 1.6, 0, 'cheese'], 'Edam / Gouda cheese': [1.4, 17.6, 2, 0, 'cheese'], 'Mozzarella': [1, 13, 1.2, 0, 'cheese'],
  'Feta cheese': [4, 15, 2.8, 0, 'cheese'], 'Parmesan': [0.8, 19, 2.9, 0, 'cheese'], 'Cream cheese': [3.2, 19, 0.8, 0, 'cheese'],
  'Butter': [0.1, 51, 0.03, 0, 'fat'], 'Sour cream': [2.9, 11.5, 0.2], 'Heavy cream': [2.8, 23, 0.07],
  'Rice, white, cooked': [0.1, 0.1, 0], 'Rice, white, dry': [0.1, 0.2, 0.01], 'Rice, brown, cooked': [0.2, 0.3, 0], 'Pasta, cooked': [0.6, 0.2, 0],
  'Pasta, dry': [2.7, 0.3, 0.02], 'Oats, rolled': [1, 1.1, 0.02], 'Bread, white': [5, 0.7, 1.2], 'Bread, whole wheat': [4.3, 0.7, 1.1],
  'Bread, rye': [3.9, 0.6, 1.5], 'Tortilla, wheat': [3, 2.5, 1.2], 'Quinoa, cooked': [0.9, 0.2, 0.02], 'Couscous, cooked': [0.1, 0, 0.01],
  'Bulgur, cooked': [0.1, 0, 0.01], 'Buckwheat, cooked': [0.9, 0.1, 0.01], 'Potato, raw': [0.8, 0, 0.02], 'Potato, boiled': [0.9, 0, 0.01],
  'Sweet potato, raw': [4.2, 0, 0.14], 'Sweet potato, baked': [6.5, 0.1, 0.09], 'Cornflakes': [8, 0.1, 1.3], 'Rice cakes': [0.9, 0.6, 0.3],
  'Apple': [10.4, 0, 0, FV], 'Banana': [12.2, 0.1, 0, FV], 'Orange': [9.4, 0, 0, FV], 'Mandarin': [10.6, 0, 0, FV], 'Strawberries': [4.9, 0, 0, FV],
  'Blueberries': [10, 0, 0, FV], 'Raspberries': [4.4, 0, 0, FV], 'Grapes': [15.5, 0.1, 0, FV], 'Watermelon': [6.2, 0, 0, FV], 'Pear': [9.8, 0, 0, FV],
  'Peach': [8.4, 0, 0, FV], 'Plum': [9.9, 0, 0, FV], 'Kiwi': [9, 0, 0, FV], 'Pineapple': [9.9, 0, 0, FV], 'Mango': [13.7, 0.1, 0, FV],
  'Cherries': [12.8, 0, 0, FV], 'Grapefruit': [7, 0, 0, FV], 'Lemon': [2.5, 0, 0, FV], 'Avocado': [0.7, 2.1, 0.02, FV], 'Dates': [66, 0, 0, FV], 'Raisins': [59, 0.1, 0.03, FV],
  'Tomato': [2.6, 0, 0.01, FV], 'Cucumber': [1.7, 0, 0, FV], 'Carrot': [4.7, 0, 0.17, FV], 'Broccoli': [1.7, 0, 0.08, FV], 'Cauliflower': [1.9, 0.1, 0.08, FV],
  'Spinach': [0.4, 0.1, 0.2, FV], 'Lettuce': [0.8, 0, 0.07, FV], 'Bell pepper': [4.2, 0, 0.01, FV], 'Onion': [4.2, 0, 0.01, FV], 'Garlic': [1, 0.1, 0.04, FV],
  'Zucchini': [2.5, 0.1, 0.02, FV], 'Mushrooms': [2, 0.1, 0.01, FV], 'Green beans': [3.3, 0.1, 0.02, FV], 'Peas': [5.7, 0.1, 0.01, FV],
  'Sweet corn': [6.3, 0.3, 0.04, FV], 'Cabbage': [3.2, 0, 0.05, FV], 'Eggplant': [3.5, 0, 0.01, FV], 'Beetroot': [6.8, 0, 0.2, FV],
  'Asparagus': [1.9, 0, 0.01, FV], 'Radish': [1.9, 0, 0.1, FV], 'Pumpkin': [2.8, 0.1, 0, FV],
  'Almonds': [4.4, 3.8, 0, FV], 'Walnuts': [2.6, 6.1, 0, FV], 'Cashews': [5.9, 7.8, 0.03, FV], 'Peanuts': [4.7, 6.3, 0.05, FV], 'Hazelnuts': [4.3, 4.5, 0, FV],
  'Pistachios': [7.7, 5.9, 0, FV], 'Peanut butter': [9, 10, 0.9, FV], 'Chia seeds': [0, 3.3, 0.04], 'Flax seeds': [1.6, 3.7, 0.08],
  'Sunflower seeds': [2.6, 4.5, 0.02], 'Pumpkin seeds': [1.4, 8.7, 0.02],
  'Olive oil': [0, 14, 0, FV, 'fat'], 'Sunflower oil': [0, 10.3, 0, 0, 'fat'], 'Coconut oil': [0, 82, 0, 0, 'fat'],
  'Olives': [0, 1.4, 3.9, FV], 'Hummus': [0.5, 1.4, 0.95, 50], 'Mayonnaise': [0.6, 11.7, 1.6],
  'Honey': [82, 0, 0.01], 'Sugar': [100, 0, 0], 'Maple syrup': [60, 0, 0.03], 'Jam': [49, 0, 0.08], 'Dark chocolate (70%)': [24, 24.5, 0.05],
  'Milk chocolate': [52, 18.5, 0.2], 'Ketchup': [22, 0, 2.3, 50], 'Mustard': [0.9, 0.2, 2.8],
  'Orange juice': [8.4, 0, 0, FV, 'bev'], 'Apple juice': [9.6, 0, 0, FV, 'bev'], 'Coffee, black': [0, 0, 0, 0, 'bev'], 'Cola': [10.6, 0, 0.01, 0, 'bev'],
  'Beer': [0, 0, 0, 0, 'none'], 'Wine, red': [0.6, 0, 0, 0, 'none'], 'Wine, white': [1, 0, 0, 0, 'none'],
  'Oat milk': [4, 0.2, 0.1], 'Almond milk, unsweetened': [0, 0.1, 0.13], 'Soy milk, unsweetened': [0.4, 0.3, 0.1],
};

// Health grade A-E, calculated with the published Nutri-Score formula (2017 version) from values per 100 g.
// x = { kcal, p, f (fat), fi (fiber), su (sugars), sf (saturated fat), sa (salt), fv (% fruit/veg/pulses/nuts), type }
function nutriGrade(x) {
  if (x.type === 'none') return null;
  const pts = (v, steps) => steps.filter(t => v > t).length;
  const seq = (start, step, n) => Array.from({ length: n }, (_, i) => start + i * step);
  const kj = x.kcal * 4.184, sodium = (x.sa || 0) * 400, fv = x.fv || 0, bev = x.type === 'bev';
  let bad, fvPts;
  if (bev) {
    bad = pts(kj, seq(0, 30, 10)) + pts(x.su || 0, seq(0, 1.5, 10)) + pts(x.sf || 0, seq(1, 1, 10)) + pts(sodium, seq(90, 90, 10));
    fvPts = fv > 80 ? 10 : fv > 60 ? 4 : fv > 40 ? 2 : 0;
  } else {
    const satPts = x.type === 'fat' ? pts(x.f ? (x.sf || 0) / x.f * 100 : 0, seq(9.99, 6, 10)) : pts(x.sf || 0, seq(1, 1, 10));
    bad = pts(kj, seq(335, 335, 10)) + pts(x.su || 0, [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]) + satPts + pts(sodium, seq(90, 90, 10));
    fvPts = fv > 80 ? 5 : fv > 60 ? 2 : fv > 40 ? 1 : 0;
  }
  const fiberPts = pts(x.fi || 0, [0.9, 1.9, 2.8, 3.7, 4.7]), proteinPts = pts(x.p || 0, [1.6, 3.2, 4.8, 6.4, 8]);
  const countProtein = bad < 11 || x.type === 'cheese' || fvPts >= (bev ? 10 : 5);
  const score = bad - fvPts - fiberPts - (countProtein ? proteinPts : 0);
  if (bev) return score <= 1 ? 'B' : score <= 5 ? 'C' : score <= 9 ? 'D' : 'E';
  return score <= -1 ? 'A' : score <= 2 ? 'B' : score <= 10 ? 'C' : score <= 18 ? 'D' : 'E';
}

const BASE = BASE_RAW.map(r => {
  const n = NUTRI[r[0]] || [];
  const f = {
    id: 'b:' + r[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: r[0], kcal: r[1], p: r[2], c: r[3], f: r[4], fi: FIBER[r[0]] || 0,
    su: n[0] || 0, sf: n[1] || 0, sa: n[2] || 0, fv: n[3] || 0, type: n[4] || '',
    serving: r[5] ? { label: r[5], g: r[6] } : null,
  };
  f.gr = nutriGrade(f);
  return f;
});
const BASE_MAP = Object.fromEntries(BASE.map(f => [f.id, f]));
