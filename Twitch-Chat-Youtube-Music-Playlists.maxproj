{
	"name" : "Twitch-Chat-Youtube-Music-Playlists",
	"version" : 1,
	"creationdate" : 3769128531,
	"modificationdate" : 3769278322,
	"viewrect" : [ 25.0, 119.0, 300.0, 500.0 ],
	"autoorganize" : 1,
	"hideprojectwindow" : 0,
	"showdependencies" : 1,
	"autolocalize" : 1,
	"contents" : 	{
		"patchers" : 		{
			"chat-youtube.maxpat" : 			{
				"kind" : "patcher",
				"local" : 1,
				"toplevel" : 1
			}
,
			"isDarkMode_me.maxpat" : 			{
				"kind" : "patcher",
				"local" : 1
			}
,
			"n4m.monitor.maxpat" : 			{
				"kind" : "patcher",
				"local" : 1
			}

		}
,
		"media" : 		{
			"rewind.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"pause.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"play.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"ff.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"rewindDark.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"ffdark.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"pauseDark.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}
,
			"playDark.png" : 			{
				"kind" : "imagefile",
				"local" : 1
			}

		}
,
		"code" : 		{
			"chat.js" : 			{
				"kind" : "javascript",
				"local" : 1
			}
,
			"fit_jweb_to_bounds.js" : 			{
				"kind" : "javascript",
				"local" : 1
			}
,
			"resize_n4m_monitor_patcher.js" : 			{
				"kind" : "javascript",
				"local" : 1
			}
,
			"twitch_me.js" : 			{
				"kind" : "javascript",
				"local" : 1,
				"singleton" : 				{
					"bootpath" : "~/Documents/Streaming/OBS-Max Stuff",
					"projectrelativepath" : "../../Streaming/OBS-Max Stuff"
				}

			}

		}
,
		"externals" : 		{

		}

	}
,
	"layout" : 	{

	}
,
	"searchpath" : 	{

	}
,
	"detailsvisible" : 0,
	"amxdtype" : 0,
	"readonly" : 0,
	"devpathtype" : 0,
	"devpath" : ".",
	"sortmode" : 0,
	"viewmode" : 0,
	"includepackages" : 0
}
