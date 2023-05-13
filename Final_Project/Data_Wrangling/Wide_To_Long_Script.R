library(tidyverse)

# Read the CSV file
data <- read.csv("/Users/ian/Documents/GitHub/Interactive-Data-Vis-Spring2023/data/final/CensusData.csv")

# Remove leading spaces in the "County" column
data$County <- trimws(data$County)

# Recode the data from wide to long format
long_data <- data %>%
  pivot_longer(
    cols = starts_with("Owner_"), 
    names_to = c("Owner_Status", "Plumbing"), 
    names_sep = "_",
    values_to = "Owner_Count"
  ) %>%
  pivot_longer(
    cols = starts_with("Renter_"), 
    names_to = c("Renter_Status", "Plumbing"), 
    names_sep = "_",
    values_to = "Renter_Count"
  ) %>%
  separate(Owner_Status, into = c("Occupancy_type", "Owner_Category"), sep = "_", remove = FALSE) %>%
  separate(Renter_Status, into = c("Occupancy_type", "Renter_Category"), sep = "_", remove = FALSE) %>%
  mutate(Plumbing = ifelse(Plumbing == "plumbing", "Yes", "No")) %>%
  select(-c(Owner_Category, Renter_Category)) %>%
  arrange(GEOID)

# Write the long format data to a new CSV file
write.csv(long_data, "/Users/ian/Documents/GitHub/Interactive-Data-Vis-Spring2023/data/final/long_data.csv", row.names = FALSE)
