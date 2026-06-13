import { useQuery } from "@tanstack/react-query";
import contactListData from "../../jsonData/contactListData.json";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const ContactList = () => {
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <b
              key={index}
              style={{ backgroundColor: "#fff59d", color: "#000" }}
            >
              {part}
            </b>
          ) : (
            <>{part}</>
          )
        )}
      </span>
    );
  };
  const data = contactListData;
  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await data;
      return res;
    },
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  const fuzzyMatch = (search: string, text: string) => {
    search = search.toLowerCase().replace(/\s/g, "");
    text = text.toLowerCase().replace(/\s/g, "");

    let searchIndex = 0;
    let textIndex = 0;

    while (searchIndex < search.length && textIndex < text.length) {
      if (search[searchIndex] === text[textIndex]) {
        searchIndex++;
      }
      textIndex++;
    }

    return searchIndex === search.length;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = React.useMemo(() => {
    if (!query.data) return [];
    if (!searchTerm.trim()) return query.data;

    return query.data.filter((contact) => {
      const fullName = `${contact.first_name} ${contact.last_name}`;
      return fuzzyMatch(searchTerm, fullName);
    });
  }, [query.data, searchTerm]);

  const populateImageFisrtName = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return initials;
  };

  return (
    <div className="contactListRoot">
      <h1 className="text-2xl">Contact List </h1>
      <TextField
        id="outlined-basic"
        label="Search Contacts"
        variant="outlined"
        placeholder="Search Contacts"
        className="searchTextfield"
        value={searchTerm}
        onChange={handleSearch}
      />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          height: "100%",
          maxHeight: "400px",
        }}
      >
        {filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const fullName = `${contact?.first_name} ${contact?.last_name}`;
            return (
              <>
                <ListItem alignItems="flex-start" key={contact?.id}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src={contact.avatar || populateImageFisrtName(fullName)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getHighlightedText(fullName, searchTerm)}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {contact.mobile}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </>
            );
          })
        ) : (
          <>No Records Found</>
        )}
      </List>

      {/* <Autocomplete
        disablePortal
        options={query?.data?.map((contact) => contact.first_name)}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Search Contacts" />
        )}
      /> */}
    </div>
  );
};

export default ContactList;
