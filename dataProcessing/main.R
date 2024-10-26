library(tidyverse)

temp_notes <- readxl::read_excel("./data/759Temp7.xls") %>%
  slice(1:12)

temp <- readxl::read_excel("./data/759Temp7.xls", skip = 12,na = "-999.9") %>%
  rename(AD = 1,
        reconstructed = 2,
        observed = 3) %>%
  filter(!is.na(AD))

temp_smooth_notes <- readxl::read_excel("./data/TempReconst7Final.xls") %>%
  slice(1:14)

temp_smooth <- readxl::read_excel("./data/TempReconst7Final.xls", skip = 14, na ="-50.00") %>%
  pivot_longer(names_to = "variables", values_to = "values", -c(AD)) %>%
  mutate(values = ifelse(values == -50.00, NA, values)) %>%
  pivot_wider(names_from = "variables", values_from = "values")

bloom_notes <- readxl::read_excel("./data/KyotoFullFlower7.xls", col_names = F) %>%
  slice(1:25)

bloom <- readxl::read_excel("./data/KyotoFullFlower7.xls", skip = 24)

bloom_notes <- readxl::read_excel("./data/KyotoFullFlower7.xls", col_names = F) %>%
  slice(1:25)

source_lu <- bloom_notes %>%
  slice(8:15) %>%
  select(1) %>%
  rename(lu = 1) %>%
  separate(lu, c("code", "source"), sep = ":|;") %>%
  mutate(source = str_trim(source, "left"))

type_lu <- bloom_notes %>%
  slice(17:23) %>%
  select(1) %>%
  rename(lu = 1) %>%
  separate(lu, c("code", "type"), sep = ":|;") %>%
  mutate(type = str_trim(type, "left"))

bloom <- readxl::read_excel("./data/KyotoFullFlower7.xls", skip = 24) %>%
  mutate(`Reference Name` = ifelse(`Reference Name` == "-", NA, `Reference Name`))

df <- bloom %>%
  full_join(temp) %>%
  full_join(temp_smooth) %>%
  write_csv("../data/data.csv")
