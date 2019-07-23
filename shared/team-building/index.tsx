import * as React from 'react'
import * as Kb from '../common-adapters/index'
import * as Styles from '../styles'
import * as Container from '../util/container'
import * as SettingsGen from '../actions/settings-gen'
import TeamBox from './team-box'
import ServiceTabBar from './service-tab-bar'
import UserResult from './user-result'
import Flags from '../util/feature-flags'
import {serviceIdToAccentColor, serviceIdToIconFont, serviceIdToLabel} from './shared'
import {ServiceIdWithContact, FollowingState} from '../constants/types/team-building'
import {Props as OriginalRolePickerProps} from '../teams/role-picker'
import {TeamRoleType} from '../constants/types/teams'

type SearchResult = {
  userId: string
  username: string
  prettyName: string
  displayLabel: string
  services: {[K in ServiceIdWithContact]?: string}
  inTeam: boolean
  isPreExistingTeamMember: boolean
  followingState: FollowingState
}

export type RolePickerProps = {
  onSelectRole: (role: TeamRoleType) => void
  sendNotification: boolean
  changeSendNotification: (sendNotification: boolean) => void
  showRolePicker: boolean
  changeShowRolePicker: (showRolePicker: boolean) => void
  selectedRole: TeamRoleType
  disabledRoles: OriginalRolePickerProps['disabledRoles']
}

type Props = {
  fetchUserRecs: () => void
  highlightedIndex: number | null
  onAdd: (userId: string) => void
  onBackspace: () => void
  onChangeService: (newService: ServiceIdWithContact) => void
  onChangeText: (newText: string) => void
  onDownArrowKeyDown: () => void
  onEnterKeyDown: () => void
  onFinishTeamBuilding: () => void
  onMakeItATeam: () => void
  onRemove: (userId: string) => void
  onSearchForMore: () => void
  onUpArrowKeyDown: () => void
  recommendations: Array<SearchResult> | null
  searchResults: Array<SearchResult> | null
  searchString: string
  selectedService: ServiceIdWithContact
  serviceResultCount: {[K in ServiceIdWithContact]?: number | null}
  showRecs: boolean
  showServiceResultCount: boolean
  teamSoFar: Array<{
    userId: string
    prettyName: string
    service: ServiceIdWithContact
    username: string
  }>
  waitingForCreate: boolean
  rolePickerProps?: RolePickerProps
}

const BannerBox = (props: {
  children?: React.ReactNode
  color: string
  gap?: keyof typeof Styles.globalMargins
}) => (
  <Kb.Box2
    direction="vertical"
    fullWidth={true}
    style={Styles.collapseStyles([styles.bannerStyle, {backgroundColor: props.color}])}
    gap={props.gap}
  >
    {props.children}
  </Kb.Box2>
)

const ContactsBanner = () => {
  const dispatch = Container.useDispatch()

  const contactsImported = Container.useSelector(s => s.settings.contacts.importEnabled)
  const arePermissionsGranted = Container.useSelector(s => s.settings.contacts.permissionStatus)
  // Although we won't use this if we early exit after subsequent checks, React
  // won't let us use hooks unless the execution is the same every time.
  const onImportContacts = React.useCallback(
    () =>
      dispatch(
        arePermissionsGranted !== 'granted'
          ? SettingsGen.createRequestContactPermissions({thenToggleImportOn: true})
          : SettingsGen.createEditContactImportEnabled({enable: true})
      ),
    [dispatch, arePermissionsGranted]
  )
  if (!Flags.sbsContacts) return null
  if (!Styles.isMobile) return null

  // Ensure that we know whether contacts are loaded, and if not, that we load
  // the current config setting.
  if (contactsImported === null) {
    dispatch(SettingsGen.createLoadContactImportEnabled())
    return null
  }
  // If we've imported contacts already, then there's nothing for us to do.
  if (contactsImported) return null

  return (
    <BannerBox color={Styles.globalColors.blue}>
      <Kb.Box direction="horizontal" fullWidth={true}>
        <Kb.Icon type="icon-fancy-user-card-mobile-120-149" />
        <Kb.Text type="BodyBig">
          Import your phone contacts and start encrypted chats with your friends.
        </Kb.Text>
      </Kb.Box>
      <Kb.Box direction="horizontal" fullWidth={true}>
        <Kb.Button label="Import contacts" backgroundColor="blue" onClick={onImportContacts} />
        <Kb.Button label="Later" backgroundColor="blue" mode="Secondary" onClick={undefined /* TODO */} />
      </Kb.Box>
    </BannerBox>
  )
}

class TeamBuilding extends React.PureComponent<Props, {}> {
  componentDidMount = () => {
    this.props.fetchUserRecs()
  }

  render = () => {
    const props = this.props
    const showRecPending = !props.searchString && !props.recommendations
    const showLoading = !!props.searchString && !props.searchResults
    const showRecs = props.showRecs
    return (
      <Kb.Box2 direction="vertical" style={styles.container} fullWidth={true}>
        {Styles.isMobile ? (
          <Kb.Box2 direction="horizontal" fullWidth={true}>
            <TeamBox
              onChangeText={props.onChangeText}
              onDownArrowKeyDown={props.onDownArrowKeyDown}
              onUpArrowKeyDown={props.onUpArrowKeyDown}
              onEnterKeyDown={props.onEnterKeyDown}
              onFinishTeamBuilding={props.onFinishTeamBuilding}
              onRemove={props.onRemove}
              teamSoFar={props.teamSoFar}
              onBackspace={props.onBackspace}
              searchString={props.searchString}
              rolePickerProps={props.rolePickerProps}
            />
          </Kb.Box2>
        ) : (
          <TeamBox
            onChangeText={props.onChangeText}
            onDownArrowKeyDown={props.onDownArrowKeyDown}
            onUpArrowKeyDown={props.onUpArrowKeyDown}
            onEnterKeyDown={props.onEnterKeyDown}
            onFinishTeamBuilding={props.onFinishTeamBuilding}
            onRemove={props.onRemove}
            teamSoFar={props.teamSoFar}
            onBackspace={props.onBackspace}
            searchString={props.searchString}
            rolePickerProps={props.rolePickerProps}
          />
        )}
        {!!props.teamSoFar.length && Flags.newTeamBuildingForChatAllowMakeTeam && (
          <Kb.Text type="BodySmall">
            Add up to 14 more people. Need more?
            <Kb.Text type="BodySmallPrimaryLink" onClick={props.onMakeItATeam}>
              {' '}
              Make it a team.
            </Kb.Text>
          </Kb.Text>
        )}
        <ServiceTabBar
          selectedService={props.selectedService}
          onChangeService={props.onChangeService}
          serviceResultCount={props.serviceResultCount}
          showServiceResultCount={props.showServiceResultCount}
        />
        <ContactsBanner />
        {showRecPending || showLoading ? (
          <Kb.Box2 direction="vertical" fullWidth={true} gap="xtiny" style={styles.loadingContainer}>
            <Kb.Icon
              style={Kb.iconCastPlatformStyles(styles.loadingIcon)}
              type="icon-progress-grey-animated"
            />
            <Kb.Text type="BodySmallSemibold">Loading</Kb.Text>
          </Kb.Box2>
        ) : !showRecs && !props.showServiceResultCount && !!props.selectedService ? (
          <Kb.Box2
            alignSelf="center"
            centerChildren={true}
            direction="vertical"
            fullHeight={true}
            fullWidth={true}
            gap="tiny"
            style={styles.emptyContainer}
          >
            <Kb.Icon
              fontSize={Styles.isMobile ? 48 : 64}
              type={serviceIdToIconFont(props.selectedService)}
              style={Styles.collapseStyles([
                !!props.selectedService && {color: serviceIdToAccentColor(props.selectedService)},
              ])}
            />
            <Kb.Text center={true} type="BodyBig">
              Enter a {serviceIdToLabel(props.selectedService)} username above.
            </Kb.Text>
            <Kb.Text center={true} type="BodySmall">
              Start a Keybase chat with anyone on {serviceIdToLabel(props.selectedService)}, even if they
              don’t have a Keybase account.
            </Kb.Text>
          </Kb.Box2>
        ) : (
          <Kb.List
            items={showRecs ? props.recommendations || [] : props.searchResults || []}
            selectedIndex={props.highlightedIndex || 0}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            keyProperty={'key'}
            onEndReached={props.onSearchForMore}
            renderItem={(index, result) => (
              <UserResult
                resultForService={props.selectedService}
                fixedHeight={400}
                username={result.username}
                prettyName={result.prettyName}
                displayLabel={result.displayLabel}
                services={result.services}
                inTeam={result.inTeam}
                isPreExistingTeamMember={result.isPreExistingTeamMember}
                followingState={result.followingState}
                highlight={!Styles.isMobile && index === props.highlightedIndex}
                onAdd={() => props.onAdd(result.userId)}
                onRemove={() => props.onRemove(result.userId)}
              />
            )}
          />
        )}
        {props.waitingForCreate && (
          <Kb.Box2 direction="vertical" style={styles.waiting} alignItems="center">
            <Kb.ProgressIndicator type="Small" white={true} style={styles.waitingProgress} />
          </Kb.Box2>
        )}
      </Kb.Box2>
    )
  }
}

const styles = Styles.styleSheetCreate({
  bannerStyle: Styles.platformStyles({
    common: {
      ...Styles.globalStyles.flexBoxColumn,
      alignItems: 'center',
      backgroundColor: Styles.globalColors.red,
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingBottom: 8,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 8,
    },
    isElectron: {
      marginBottom: Styles.globalMargins.tiny,
    },
  }),
  container: Styles.platformStyles({
    common: {
      flex: 1,
      minHeight: 200,
      position: 'relative',
    },
    isElectron: {
      borderRadius: 4,
      height: 434,
      overflow: 'hidden',
      width: 470,
    },
  }),
  emptyContainer: Styles.platformStyles({
    common: {
      flex: 1,
    },
    isElectron: {
      maxWidth: 290,
      paddingBottom: 40,
    },
    isMobile: {
      maxWidth: '80%',
    },
  }),
  list: Styles.platformStyles({
    common: {
      paddingBottom: Styles.globalMargins.small,
    },
    isElectron: {
      marginLeft: Styles.globalMargins.small,
      marginRight: Styles.globalMargins.small,
    },
  }),
  listContentContainer: Styles.platformStyles({
    isMobile: {
      paddingTop: Styles.globalMargins.xtiny,
    },
  }),
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingIcon: Styles.platformStyles({
    isElectron: {
      height: 32,
      width: 32,
    },
    isMobile: {
      height: 48,
      width: 48,
    },
  }),
  mobileFlex: Styles.platformStyles({
    isMobile: {flex: 1},
  }),
  waiting: {
    ...Styles.globalStyles.fillAbsolute,
    backgroundColor: Styles.globalColors.black_20,
  },
  waitingProgress: {
    height: 48,
    width: 48,
  },
})

export default TeamBuilding
