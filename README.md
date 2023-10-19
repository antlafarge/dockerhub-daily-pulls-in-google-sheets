# dockerhub-daily-pulls-in-google-sheets

Store dockerhub daily pulls in a google sheet.  
Your repository must be a public repository.

# Execute the script to grab the pulls daily

- Create a new Google Sheet.
  - In cell #A1, type `Date`.
  - In cell #B1, type the name of the dockerhub repository by using this format : `<AccountName>/<RepositoryName>`.
  - Be sure there is at least 1000 empty lines in the sheet (the script doesn't create lines automatically).
  - If you want the daily pulls count :
    - In the cell #C1, type `Daily pulls`.
    - In the cell #C2, type `=IF(AND(ISNUMBER(B1);ISNUMBER(B2));B2-B1;)`.
    - Expand this formula on all lines by using the bottom right cross tool (Hold click and slide to last line cell).
- Create the script :
  - Go to `Extensions` / `Apps script`.
  - Replace the content of the Apps script file `Code.gs` by the code of this repository file `Code.gs`.
- Execute the script daily :
  - In the left menu select `Triggers` / `Add a trigger` and fill the form :
    - Function to execute : `main`.
    - Event source : `Time trigger`.
    - Temporal trigger type : `Daily`.
  - Click on `Save`.
  - Select the `main` function in top menu and click `Execute`.
    - Check there is no errors and that the exexution finishes successfully.
    - If you added the daily pulls count column, click another time to have check the daily pulls count is working correctly.
- Finally you can create a chart to see visually the pulls count or daily pulls count.
