//$$('a').map(a=> a.text)


var articles = ["1689 Boston revolt",
"1740 Batavia massacre",
"1907 Tiflis bank robbery",
//"1960 South Vietnamese coup attempt", // REMOVE THIS IF HAVE ENOUGH
//"1962 South Vietnamese Independence Palace bombing",
"1964 Brinks Hotel bombing",
"1981 Irish hunger strike",
"Act of Independence of Lithuania", //č
"Amundsen's South Pole expedition",
"Ancient Egypt",
//"Arrest and assassination of Ngo Dinh Diem", // if decide to keep remove dialogue
"Assassination of William McKinley",
"Bal des Ardents",
"Benedict Arnold's expedition to Quebec",
"Birmingham campaign",
"Blackwater fire of 1937",
"British contribution to the Manhattan Project",
"British Empire",
"Brown Dog affair",
"Burning of Parliament", //Think about abbreaviations
"Byzantine Empire",
"California Gold Rush",
"Chalukya dynasty",
"Clinton Engineer Works",
"Convention of 1832",
"Convention of 1833",
"Confederate government of Kentucky",
//"December 1964 South Vietnamese coup", //have odd letters
"Discovery Expedition",
"Donner Party", //Mrs. is giving error here!!! ----- Jr. was working before ---------------------------------------------
//"Double Seven Day scuffle", //have odd letters
//"Empire of Brazil", //have odd letters, but alot of sentences
"Exhumation and reburial of Richard III of England",
"Farthest South", //sentence 26 seperate 2 sentences
"Fredonian Rebellion",
"Free State of Galveston", // remove last sentence
"French colonization of Texas", //St. sentence error
"George S. Patton slapping incidents",
"Great Fire of London",
"Great Stink",
"Gunpowder Plot", //St.
"Halifax Explosion",
"Han dynasty",
"History of the Australian Capital Territory",
"History of Burnside",
"History of Minnesota",
"History of Solidarity",
"History of the Yosemite area", //Dr. Lt.
"Hoysala Empire",
//"Hungarian Revolution of 1956", //Á
//"Imperial Trans-Antarctic Expedition", //quotes from reading //CONTINUE CHECKING HERE!!!!!!!!!!!!!!!!!!!!!!!!
"Inner German border", // saying: 'We're coming soon.' (check for this case)
"Iranian Embassy siege",
"Jarrow March", // remove don't like
"Jeannette Expedition", //of desolation ... I hope I may ne
"June 1941 uprising in eastern Herzegovina",
"July 2009 Ürümqi riots",
"Kingdom of Mysore"
]
// "Manhattan Project",
// "Manzanar",
// "Maya civilization",
// "Middle Ages",
// "Ming dynasty",
// "Mormon handcart pioneers",
// "Mortara case",
// "Muhammad al-Durrah incident",
// "Murder of Julia Martha Thomas",
// "Mutiny on the Bounty",
// "Nansen's Fram expedition",
// "Natchez revolt",
// "New South Greenland",
// "Night of the Long Knives",
// "Nimrod Expedition",
// "Norman conquest of England",
// "Norte Chico civilization",
// "Nyon Conference",
// "Oklahoma City bombing",
// "Operation Barras",
// "Operation Passage to Freedom",
// "Operation Tungsten",
// "Parthian Empire",
// "Peasants' Revolt",
// "Peterloo Massacre",
// "Plymouth Colony",
// "Political history of medieval Karnataka",
// "Political history of Mysore and Coorg (1565–1760)",
// "Political integration of India",
// "Rashtrakuta dynasty",
// "Red Barn Murder",
// "Red River Trails",
// "Retiarius",
// "Rock Springs massacre",
// "Ross Sea party 1914–16",
// "Runaway Scrape",
// "S. A. Andrée's Arctic Balloon Expedition of 1897",
// "Saint-Sylvestre coup d'état",
// "Scotland in the High Middle Ages",
// "Scottish National Antarctic Expedition",
// "Second Crusade",
// "Senghenydd colliery disaster",
// "September 1964 South Vietnamese coup attempt",
// "Shackleton–Rowett Expedition",
// "Siege of Sidney Street",
// "Singapore strategy",
// "Sinking of the RMS Titanic",
// "Slavery in ancient Greece",
// "Smyth Report",
// "Song dynasty",
// "Southern Cross Expedition",
// "Spanish conquest of Guatemala",
// "Spanish conquest of Petén",
// "SS Arctic disaster",
// "Steamtown, U.S.A.",
// "Swedish emigration to the United States",
// "SY Aurora's drift",
// "Sydney Riot of 1879",
// "Tang dynasty",
// "Terra Nova Expedition",
// "Texas Revolution",
// "Tiananmen Square self-immolation incident",
// "Sino-Tibetan relations during the Ming dynasty",
// "To the People of Texas & All Americans in the World",
// "Treaty of Devol",
// "Trinity (nuclear test)",
// "Unification of Germany",
// "United States presidential election, 1880",
// "Vijayanagara Empire",
// "Voyage of the James Caird",
// "Last voyage of the Karluk",
// "Western Chalukya Empire",
// "Western Ganga dynasty",
// "Xá Lợi Pagoda raids",
// "Yellowstone fires of 1988",
// "Zanzibar Revolution"]

function replaceEmptySpace(arr){
  var updatedArr = arr.map((s)=>{
    console.log(s);
    return s.replace(/ /g, '%20')
  })
  return updatedArr;
}

var updatedArticleTitles = replaceEmptySpace(articles);
console.log(updatedArticleTitles)
